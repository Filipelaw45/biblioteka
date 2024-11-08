describe('Login Page Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login'); // Visita a página de login antes de cada teste
  });

  it('should display login form', () => {
    cy.get('h2').contains('Login'); // Verifica se o título "Login" está presente
    cy.get('input[name="username"]').should('exist'); // Verifica se o campo de usuário existe
    cy.get('input[name="password"]').should('exist'); // Verifica se o campo de senha existe
    cy.get('button[type="submit"]').contains('Entrar'); // Verifica se o botão "Entrar" está presente
  });

  it('should login with valid credentials', () => {
    cy.get('input[name="username"]').type('user1'); // Preenche o campo de usuário
    cy.get('input[name="password"]').type('senha123'); // Preenche o campo de senha
    cy.get('button[type="submit"]').click(); // Clica no botão "Entrar"

    // Verifica se foi redirecionado para a página inicial ou outra página relevante
    cy.url().should('include', '/'); // Supondo que a URL da página inicial inclua '/'
  });

  it('should display alert for invalid credentials', () => {
    cy.get('input[name="username"]').type('invalidUser'); // Preenche com um usuário inválido
    cy.get('input[name="password"]').type('senhaErrada'); // Preenche com uma senha inválida
    cy.get('button[type="submit"]').click(); // Clica no botão "Entrar"

    // Captura e verifica o texto do alert
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.equal('Usuário ou senha inválidos'); // Verifica se o texto do alert está correto
    });
  });
});

describe('Home Page Tests', () => {
  beforeEach(() => {
    // Primeiro, faz login
    cy.visit('http://localhost:5173/login'); // Visita a página de login
    cy.wait(1000);
    cy.get('input[name="username"]').type('user1'); // Preenche o campo de usuário
    cy.get('input[name="password"]').type('senha123'); // Preenche o campo de senha
    cy.get('button[type="submit"]').click(); // Clica no botão "Entrar"

    // Verifica se foi redirecionado para a página inicial
    cy.url().should('include', '/'); // Verifica se a URL contém '/'
    cy.wait(1000);
  });

  it('should display the search input and book list', () => {
    cy.get('input[type="text"]').should('exist'); // Verifica se o campo de busca existe
    cy.get('select[name="typeSearch"]').should('exist'); // Verifica se o seletor de tipo de busca existe
    cy.get('button').contains('Reservar').should('exist'); // Verifica se o botão "Reservar" existe
  });

  it('should filter books based on search query', () => {
    cy.get('input[type="text"]').type('O Hobbit'); // Digita um termo de busca

    // Verifica se a lista de livros foi atualizada (ajuste conforme sua lógica de renderização)
    cy.get('.sc-gtLWhw > div > :nth-child(1)').should('contain', 'O Hobbit'); // Verifica se um livro específico está na lista
  });

  it('should reserve a book', () => {
    cy.get('input[type="text"]').type('Moby Dick'); // Digita um termo de busca
    cy.wait(1000);

    // Certifique-se de que há um livro disponível para reserva
    cy.get('button').contains('Reservar').first().click(); // Clica no primeiro botão "Reservar"
    cy.wait(2000);

    // Verifica o alerta de sucesso (substitua pelo seu texto de sucesso se necessário)
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.equal('Livro reservado com sucesso'); // Verifica se o texto do alert está correto
    });
    cy.wait(2000);

    // Verifica se o livro foi reservado (ajuste conforme sua lógica)
    cy.get('button').contains('Você ja reservou esse livro').first(); // Verifica se o botão foi alterado
  });
});
