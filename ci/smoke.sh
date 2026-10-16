#!/usr/bin/env bash
# Pruebas de humo: verifican que las páginas y la API respondan como se espera.
set -u
BASE=http://localhost:8080
FALLAS=0
JAR=$(mktemp)

ok()   { echo "OK    $1"; }
fail() { echo "FALLA $1"; echo "::error title=Prueba fallida::$1"; FALLAS=$((FALLAS+1)); }

# esperar CODIGO DESCRIPCION comando-curl...
esperar() {
  local esperado=$1 desc=$2; shift 2
  local code
  code=$(curl -s -o /tmp/resp.txt -w "%{http_code}" "$@")
  if [ "$code" = "$esperado" ]; then ok "$desc ($code)"; else fail "$desc: esperado $esperado, obtuvo $code. $(head -c 300 /tmp/resp.txt)"; fi
}

csrf() { curl -s -c "$JAR" -b "$JAR" "$BASE$1" | grep -o 'name="_csrf" value="[^"]*"' | head -1 | sed 's/.*value="//;s/"//'; }

login_web() {
  local token
  token=$(csrf /login)
  curl -s -o /dev/null -c "$JAR" -b "$JAR" -d "username=$1&password=$2&_csrf=$token" "$BASE/login"
}

echo "== Web (Thymeleaf)"
esperar 200 "Página de login" "$BASE/login"
esperar 302 "Inicio sin sesión redirige a login" "$BASE/"
login_web ciadmin Prueba123
for p in / /estudiantes /estudiantes/inicial /estudiantes/egresados /apoderados /pagos /asistencias /usuarios /estudiantes/nuevo /apoderados/nuevo /pagos/nuevo /asistencias/nuevo /usuarios/nuevo; do
  esperar 200 "GET $p" -b "$JAR" "$BASE$p"
done

if [ -f ci/smoke-extra.sh ]; then source ci/smoke-extra.sh; fi

echo
if [ $FALLAS -gt 0 ]; then echo "$FALLAS prueba(s) fallaron"; exit 1; fi
echo "Todas las pruebas pasaron"
