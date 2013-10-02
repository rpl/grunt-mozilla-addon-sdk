cd %1
call bin\activate
cd %2
set COMMAND=%3
shift; shift; shift;
cfx %COMMAND% %*
