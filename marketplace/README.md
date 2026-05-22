# Mercari Marketplace

O marketplace invertido para peças raras e de luxo. Compradores publicam pedidos do que procuram e vendedores enviam ofertas personalizadas.

## Como rodar localmente

```bash
cd marketplace
npm install
npm run dev
```

Abra `http://localhost:5173` no navegador.

## Contas demo

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Comprador | comprador@demo.com | demo123 |
| Vendedor | vendedor@demo.com | demo123 |
| Ambos | ambos@demo.com | demo123 |

## Funcionalidades

- **Página inicial** — apresentação do marketplace com landing page responsiva
- **Cadastro/Login** — escolha de perfil: Comprador, Vendedor ou Ambos
- **Comprador**
  - Criar pedido (produto, marca, características, preço desejado, categoria)
  - Ver meus pedidos com contagem de ofertas
  - Ver ofertas recebidas ordenadas pelo menor preço
  - Aceitar oferta
- **Vendedor**
  - Navegar pedidos com filtro por categoria e busca livre
  - Ver detalhes do pedido e concorrência atual
  - Enviar oferta (preço, prazo, mensagem)

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS v3
- React Router v6
- Lucide React (ícones)
- localStorage (persistência sem backend)

## Cores da marca

| Token | Hex | Uso |
|-------|-----|-----|
| `brand-pink` | `#FF006E` | Ações primárias, CTA |
| `brand-blue` | `#00B4D8` | Elementos secundários |
