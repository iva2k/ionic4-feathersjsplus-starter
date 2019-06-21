@echo off

:: set code=$(where code.cmd)
pushd c:\
  for /f "tokens=*" %%i in ('where code.cmd') do set "code=%%i"
popd
:: echo code is at "%code%"
:: exit

echo.Launching VSCode for server...
cmd.exe /C "%code%" server\api\

echo.Launching VSCode for client...
cmd.exe /C "%code%" client\ionic4-feathersjsplus-starter\

echo.Done.
