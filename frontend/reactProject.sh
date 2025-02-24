# Crie um novo projeto React usando Vite
npm create vite@latest --template react

# Instale as dependências necessárias
npm install @tanstack/react-query primereact primeflex primeicons typeorm @nestjs/core @nestjs/common eslint prettier

# Instale as dependências de desenvolvimento para ESLint e Prettier
npm install --save-dev eslint prettier eslint-plugin-react eslint-config-prettier eslint-plugin-prettier

# Inicialize o ESLint
npx eslint --init

# Crie um arquivo de configuração do Prettier
echo {} > .prettierrc

# Adicione scripts ao package.json para ESLint e Prettier
jq '.scripts += {"lint": "eslint .", "format": "prettier --write ."}' package.json > tmp.$$.json && mv tmp.$$.json package.json
