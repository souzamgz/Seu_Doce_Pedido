# Seu Doce Pedido

Sistema web para gerenciamento e realização de pedidos de doces, desenvolvido com **Laravel**, **React** e **Inertia.js**.  
O projeto foi criado com foco em oferecer uma experiência moderna para clientes realizarem pedidos online, com organização por categorias, promoções, carrinho de compras e fluxo de checkout.

---

## Sobre o projeto

O **Seu Doce Pedido** é uma aplicação full stack voltada para lojas de doces, permitindo:

- Exibição de produtos organizados por categorias
- Busca e filtro de produtos
- Promoções em destaque
- Carrinho de compras
- Finalização de pedido
- Integração com pagamento
- Painel administrativo para gerenciamento da loja
- Controle de banners e status da loja

Além da vitrine para clientes, o sistema também possui uma área administrativa para apoiar a gestão da loja.

---

## Tecnologias utilizadas

### Back-end
- **PHP 8.2+**
- **Laravel 12**
- **Laravel Sanctum**
- **Doctrine DBAL**

### Front-end
- **React**
- **Inertia.js**
- **Vite**
- **Tailwind CSS**
- **Framer Motion**
- **Lucide React**
- **React Icons**

### Integrações
- **Mercado Pago**

### Ferramentas e arquitetura
- **Laravel Breeze**
- **Ziggy**
- **MySQL / SQLite** *(dependendo da configuração local)*
- **Composer**
- **NPM**

---

## Funcionalidades

### Área pública / cliente
- Visualização dos produtos da loja
- Navegação por categorias
- Busca por nome, descrição, categoria ou preço
- Exibição de promoções
- Adição de produtos ao carrinho
- Finalização do pedido
- Visualização do status da loja (aberta/fechada)
- Página institucional / sobre

### Área administrativa
- Gerenciamento de produtos
- Gerenciamento de categorias
- Gerenciamento de banners
- Controle de promoções
- Acompanhamento de pedidos
- Painel administrativo com recursos de manutenção da loja

---

## Estrutura do projeto

```bash
app/
 ├── Http/
 ├── Models/
 │   ├── Cart.php
 │   ├── Category.php
 │   ├── Product.php
 │   └── User.php

database/
 ├── migrations/
 └── seeders/

resources/
 ├── css/
 ├── js/
 │   ├── Components/
 │   ├── Layouts/
 │   └── Pages/
 │       ├── Admin/
 │       ├── Cart/
 │       ├── Checkout/
 │       ├── Pedido/
 │       ├── Sobre/
 │       ├── Dashboard.jsx
 │       └── Welcome.jsx
 └── views/

routes/
 ├── auth.php
 └── web.php
```
## 🛒 Destaques do sistema

- Interface moderna com **React + Inertia**
- Separação entre área pública e administrativa
- Carrinho de compras com fluxo completo de pedido
- Sistema de promoções por quantidade
- Banners dinâmicos para a loja
- Base preparada para evolução em um e-commerce real

---

## Como executar o projeto localmente?

### 1. Clone o repositório
```bash
git clone https://github.com/souzamgz/Seu_Doce_Pedido.git
cd Seu_Doce_Pedido
```

### 2. Instale as dependências do back-end
```bash
composer install
```

### 3. Instale as dependências do front-end
```bash
npm install
```

### 4. Configure o ambiente
Crie o arquivo `.env`:
```bash
cp .env.example .env
```

### 5. Gere a chave da aplicação
```bash
php artisan key:generate
```

### 6. Configure o banco de dados
Edite o `.env` com suas credenciais e rode:
```bash
php artisan migrate
```

### 7. Inicie o projeto
Em um terminal:
```bash
php artisan serve
```

Em outro terminal:
```bash
npm run dev
```

---

## Integração de pagamento

O projeto possui integração com **Mercado Pago**.

---

## Aprendizados com o projeto

- Estruturação de aplicação com Laravel
- Integração entre back-end e front-end com Inertia.js
- Componentização com React
- Gerenciamento de estado de interface
- Implementação de carrinho e fluxo de pedidos
- Organização de produtos por categorias
- Integração com serviços externos de pagamento

---


## Licença

Este projeto é de uso acadêmico e portfólio.
