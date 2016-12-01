rm -rf node_modules dist tmp
npm i angular-cli@latest -S

npm install
ng init --source-dir=client --style=scss --routing=true
