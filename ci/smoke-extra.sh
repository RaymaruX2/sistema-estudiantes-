# Pruebas de las funciones nuevas (se ejecuta desde smoke.sh)

echo "== Web: registro, portal de padres, detalle de apoderado"
esperar 200 "Página de registro" "$BASE/registro"
esperar 200 "Detalle de apoderado 1" -b "$JAR" "$BASE/apoderados/1"
esperar 404 "Apoderado inexistente muestra 404" -b "$JAR" "$BASE/apoderados/999999"
esperar 404 "Estudiante inexistente muestra 404" -b "$JAR" "$BASE/estudiantes/999999"
esperar 200 "Pagos filtrados por estado" -b "$JAR" "$BASE/pagos?estado=PENDIENTE&q=a"
esperar 403 "Admin no entra al portal de padres" -b "$JAR" "$BASE/mi-familia"

# Registro web de un padre (DNI que existe como apoderado en 02-data.sql)
JAR_P=$(mktemp)
T=$(curl -s -c "$JAR_P" -b "$JAR_P" "$BASE/registro" | grep -o 'name="_csrf" value="[^"]*"' | head -1 | sed 's/.*value="//;s/"//')
LOC=$(curl -s -o /dev/null -w "%{redirect_url}" -c "$JAR_P" -b "$JAR_P" \
  --data-urlencode "tipo=PADRE" --data-urlencode "nombreCompleto=Maria Aguilar" --data-urlencode "dni=42868828" \
  --data-urlencode "email=maria.padre@test.pe" --data-urlencode "password=ClavePadre1" --data-urlencode "confirmarPassword=ClavePadre1" \
  --data-urlencode "_csrf=$T" "$BASE/registro")
case "$LOC" in *"/login"*) ok "Registro de padre redirige al login";; *) fail "Registro de padre: redirigió a '$LOC'";; esac

# Registro con DNI que no es apoderado: debe quedarse en el formulario con error
T=$(curl -s -c "$JAR_P" -b "$JAR_P" "$BASE/registro" | grep -o 'name="_csrf" value="[^"]*"' | head -1 | sed 's/.*value="//;s/"//')
BODY=$(curl -s -c "$JAR_P" -b "$JAR_P" --data-urlencode "tipo=PADRE" --data-urlencode "nombreCompleto=X" --data-urlencode "dni=00000001" \
  --data-urlencode "password=ClavePadre1" --data-urlencode "confirmarPassword=ClavePadre1" --data-urlencode "_csrf=$T" "$BASE/registro")
echo "$BODY" | grep -q "no figura como apoderado" && ok "DNI desconocido muestra error" || fail "DNI desconocido no mostró el error"

# Login web del padre y su portal
T=$(curl -s -c "$JAR_P" -b "$JAR_P" "$BASE/login" | grep -o 'name="_csrf" value="[^"]*"' | head -1 | sed 's/.*value="//;s/"//')
curl -s -o /dev/null -c "$JAR_P" -b "$JAR_P" -d "username=maria.padre@test.pe&password=ClavePadre1&_csrf=$T" "$BASE/login"
LOC=$(curl -s -o /dev/null -w "%{redirect_url}" -b "$JAR_P" "$BASE/")
case "$LOC" in *"/mi-familia"*) ok "Padre es enviado a Mi familia";; *) fail "Padre en / redirigió a '$LOC'";; esac
esperar 200 "Portal Mi familia" -b "$JAR_P" "$BASE/mi-familia"
esperar 403 "Padre no puede ver todos los estudiantes" -b "$JAR_P" "$BASE/estudiantes"

# Registro de personal: queda pendiente
T=$(curl -s -c "$JAR_P" -b "$JAR_P" "$BASE/registro" | grep -o 'name="_csrf" value="[^"]*"' | head -1 | sed 's/.*value="//;s/"//')
curl -s -o /dev/null -c "$JAR_P" -b "$JAR_P" --data-urlencode "tipo=PERSONAL" --data-urlencode "nombreCompleto=Luis Docente" \
  --data-urlencode "username=ldocente" --data-urlencode "password=ClaveDocente1" --data-urlencode "confirmarPassword=ClaveDocente1" \
  --data-urlencode "_csrf=$T" "$BASE/registro"
JAR_D=$(mktemp)
T=$(curl -s -c "$JAR_D" -b "$JAR_D" "$BASE/login" | grep -o 'name="_csrf" value="[^"]*"' | head -1 | sed 's/.*value="//;s/"//')
LOC=$(curl -s -o /dev/null -w "%{redirect_url}" -c "$JAR_D" -b "$JAR_D" -d "username=ldocente&password=ClaveDocente1&_csrf=$T" "$BASE/login")
case "$LOC" in *"pendiente"*) ok "Cuenta de personal queda pendiente";; *) fail "Login de personal pendiente redirigió a '$LOC'";; esac

echo "== API REST"
API=$BASE/api
J='Content-Type: application/json'
esperar 200 "Salud" "$API/salud"
esperar 401 "Sin token no hay acceso" "$API/estudiantes"
esperar 401 "Login con clave incorrecta" -H "$J" -d '{"usuario":"ciadmin","password":"mala"}' "$API/auth/login"

TOKEN=$(curl -s -H "$J" -d '{"usuario":"ciadmin","password":"Prueba123"}' "$API/auth/login" | jq -r .token)
[ -n "$TOKEN" ] && [ "$TOKEN" != "null" ] && ok "Login API devuelve token" || fail "Login API no devolvió token"
A="Authorization: Bearer $TOKEN"

esperar 200 "Mi usuario" -H "$A" "$API/auth/yo"
esperar 200 "Resumen" -H "$A" "$API/resumen"
esperar 200 "Catálogos" -H "$A" "$API/catalogos"
esperar 200 "Listar estudiantes" -H "$A" "$API/estudiantes?nivel=PRIMARIA&size=5"
esperar 200 "Listar apoderados" -H "$A" "$API/apoderados?q=a"
esperar 200 "Apoderados para selector" -H "$A" "$API/apoderados/todos"
esperar 404 "Estudiante inexistente (API)" -H "$A" "$API/estudiantes/999999"

APO=$(curl -s -H "$A" -H "$J" -d '{"dni":"99887766","nombres":"Rosa","apellidos":"Prueba CI","telefono":"987654321","parentesco":"MADRE"}' "$API/apoderados" | jq -r .id)
[ "$APO" != "null" ] && ok "Crear apoderado (id $APO)" || fail "Crear apoderado"
esperar 400 "DNI de apoderado duplicado" -H "$A" -H "$J" -d '{"dni":"99887766","nombres":"X","apellidos":"Y","telefono":"987654321","parentesco":"PADRE"}' "$API/apoderados"
esperar 400 "Apoderado sin datos obligatorios" -H "$A" -H "$J" -d '{"dni":"11112222"}' "$API/apoderados"

EST=$(curl -s -H "$A" -H "$J" -d "{\"numeroDocumento\":\"77665544\",\"apellidoPaterno\":\"Prueba\",\"apellidoMaterno\":\"CI\",\"nombres\":\"Lucia\",\"sexo\":\"F\",\"fechaNacimiento\":\"2015-03-10\",\"nivel\":\"PRIMARIA\",\"grado\":\"TERCERO\",\"seccion\":\"A\",\"apoderadoId\":$APO}" "$API/estudiantes" | jq -r .id)
[ "$EST" != "null" ] && ok "Crear estudiante (id $EST)" || fail "Crear estudiante: $(curl -s -H "$A" -H "$J" -d '{}' "$API/estudiantes")"
esperar 200 "Editar estudiante" -X PUT -H "$A" -H "$J" -d "{\"numeroDocumento\":\"77665544\",\"apellidoPaterno\":\"Prueba\",\"apellidoMaterno\":\"CI\",\"nombres\":\"Lucia Maria\",\"sexo\":\"F\",\"fechaNacimiento\":\"2015-03-10\",\"nivel\":\"PRIMARIA\",\"grado\":\"CUARTO\",\"seccion\":\"B\",\"apoderadoId\":$APO}" "$API/estudiantes/$EST"
esperar 400 "Estudiante con documento duplicado" -H "$A" -H "$J" -d "{\"numeroDocumento\":\"77665544\",\"apellidoPaterno\":\"A\",\"apellidoMaterno\":\"B\",\"nombres\":\"C\",\"sexo\":\"M\",\"fechaNacimiento\":\"2015-03-10\",\"nivel\":\"PRIMARIA\",\"grado\":\"TERCERO\",\"seccion\":\"A\"}" "$API/estudiantes"

PAGO=$(curl -s -H "$A" -H "$J" -d "{\"apoderadoId\":$APO,\"descripcion\":\"Pensión marzo\",\"monto\":150.50,\"fechaPago\":\"2026-03-05\",\"concepto\":\"PENSION\",\"estado\":\"PENDIENTE\"}" "$API/pagos" | jq -r .id)
[ "$PAGO" != "null" ] && ok "Crear pago (id $PAGO)" || fail "Crear pago"
esperar 200 "Editar pago a PAGADO" -X PUT -H "$A" -H "$J" -d "{\"apoderadoId\":$APO,\"descripcion\":\"Pensión marzo\",\"monto\":150.50,\"fechaPago\":\"2026-03-05\",\"concepto\":\"PENSION\",\"estado\":\"PAGADO\"}" "$API/pagos/$PAGO"
esperar 200 "Buscar pagos" -H "$A" "$API/pagos?q=marzo&estado=PAGADO"
ASIS=$(curl -s -H "$A" -H "$J" -d "{\"apoderadoId\":$APO,\"tituloReunion\":\"Reunión bimestral\",\"fechaReunion\":\"2026-04-10\",\"horaReunion\":\"18:00\",\"asistio\":true}" "$API/asistencias" | jq -r .id)
[ "$ASIS" != "null" ] && ok "Crear asistencia (id $ASIS)" || fail "Crear asistencia"
esperar 200 "Listar asistencias" -H "$A" "$API/asistencias?q=bimestral"

DET=$(curl -s -H "$A" "$API/apoderados/$APO/detalle")
[ "$(echo "$DET" | jq '.hijos | length')" = "1" ] && ok "Detalle muestra al hijo" || fail "Detalle: hijos = $(echo "$DET" | jq -c .hijos)"
[ "$(echo "$DET" | jq '.totalPagado == 150.5')" = "true" ] && ok "Detalle calcula total pagado" || fail "Detalle totalPagado = $(echo "$DET" | jq -r .totalPagado)"
[ "$(echo "$DET" | jq -r .porcentajeAsistencia)" = "100" ] && ok "Detalle calcula asistencia" || fail "Detalle asistencia = $(echo "$DET" | jq -r .porcentajeAsistencia)"
esperar 200 "Ficha web del apoderado nuevo" -b "$JAR" "$BASE/apoderados/$APO"

echo "== API: usuarios y padres"
esperar 200 "Listar usuarios" -H "$A" "$API/usuarios"
PEND=$(curl -s -H "$A" "$API/usuarios" | jq -r '.[] | select(.username=="ldocente") | .id')
esperar 200 "Aprobar cuenta de personal" -X POST -H "$A" "$API/usuarios/$PEND/aprobar"
esperar 200 "Personal aprobado ya puede entrar" -H "$J" -d '{"usuario":"ldocente","password":"ClaveDocente1"}' "$API/auth/login"
YO=$(curl -s -H "$A" "$API/auth/yo" | jq -r .id)
esperar 400 "No puedes eliminarte a ti mismo" -X DELETE -H "$A" "$API/usuarios/$YO"
esperar 400 "Contraseña corta rechazada" -H "$A" -H "$J" -d '{"username":"corto","nombreCompleto":"Corto","rol":"SECRETARIA","password":"123"}' "$API/usuarios"

esperar 201 "Registro de padre por API" -H "$J" -d '{"tipo":"PADRE","nombreCompleto":"Rosa Prueba","dni":"99887766","password":"ClavePadre2","confirmarPassword":"ClavePadre2"}' "$API/auth/registro"
esperar 400 "No se registra dos veces el mismo apoderado" -H "$J" -d '{"tipo":"PADRE","nombreCompleto":"Rosa Prueba","dni":"99887766","password":"ClavePadre2","confirmarPassword":"ClavePadre2"}' "$API/auth/registro"
PT=$(curl -s -H "$J" -d '{"usuario":"99887766","password":"ClavePadre2"}' "$API/auth/login" | jq -r .token)
FAM=$(curl -s -H "Authorization: Bearer $PT" "$API/padre/mi-familia")
[ "$(echo "$FAM" | jq -r '.hijos[0].nombres')" = "LUCIA MARIA" ] && ok "Padre ve a su hija en Mi familia" || fail "Mi familia (API): $(echo "$FAM" | head -c 300)"
esperar 403 "Padre no accede a la lista de estudiantes" -H "Authorization: Bearer $PT" "$API/estudiantes"
esperar 403 "Personal no accede al portal de padres" -H "$A" "$API/padre/mi-familia"

echo "== CORS"
H=$(curl -s -o /dev/null -D - -X OPTIONS -H "Origin: https://mi-app.vercel.app" -H "Access-Control-Request-Method: GET" -H "Access-Control-Request-Headers: authorization" "$API/estudiantes")
echo "$H" | grep -qi "access-control-allow-origin: https://mi-app.vercel.app" && ok "CORS permite Vercel" || fail "CORS no permite Vercel: $H"

echo "== API: eliminar"
esperar 204 "Eliminar asistencia" -X DELETE -H "$A" "$API/asistencias/$ASIS"
esperar 204 "Eliminar pago" -X DELETE -H "$A" "$API/pagos/$PAGO"
esperar 204 "Eliminar estudiante" -X DELETE -H "$A" "$API/estudiantes/$EST"
esperar 204 "Eliminar apoderado" -X DELETE -H "$A" "$API/apoderados/$APO"
esperar 404 "Eliminar algo que no existe" -X DELETE -H "$A" "$API/pagos/999999"
