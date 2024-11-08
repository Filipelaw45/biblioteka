describe('Login Page Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login');
  });

  it('should display login form', () => {
    cy.get('h2').contains('Login');
    cy.get('input[name="username"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('button[type="submit"]').contains('Entrar');
  });

  it('should login with valid credentials', () => {
    cy.get('input[name="username"]').type('user1');
    cy.get('input[name="password"]').type('senha123');
    cy.get('button[type="submit"]').click();

    // Verifica se foi redirecionado para a página inicial ou outra página relevante
    cy.url().should('include', '/');
  });

  it('should display alert for invalid credentials', () => {
    cy.get('input[name="username"]').type('invalidUser');
    cy.get('input[name="password"]').type('senhaErrada');
    cy.get('button[type="submit"]').click();

    cy.on('window:alert', (alertText) => {
      expect(alertText).to.equal('Usuário ou senha inválidos');
    });
  });
});

describe('Home Page Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login');
    cy.wait(1000);
    cy.get('input[name="username"]').type('user1');
    cy.get('input[name="password"]').type('senha123');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/');
    cy.wait(1000);
  });

  it('should display the search input and book list', () => {
    cy.get('input[type="text"]').should('exist');
    cy.get('select[name="typeSearch"]').should('exist');
    cy.get('button').contains('Reservar').should('exist');
  });

  it('should filter books based on search query', () => {
    cy.get('input[type="text"]').type('O Hobbit');

    cy.get('.sc-gtLWhw > div > :nth-child(1)').should('contain', 'O Hobbit');
  });

  it('should reserve a book', () => {
    cy.get('input[type="text"]').type('Moby Dick');
    cy.wait(1000);

    cy.get('button').contains('Reservar').first().click();
    cy.wait(2000);

    cy.on('window:alert', (alertText) => {
      expect(alertText).to.equal('Livro reservado com sucesso');
    });
    cy.wait(2000);

    cy.get('button').contains('Você ja reservou esse livro').first();
  });
});

describe('Login another user', () => {

  it('should reserve a book', () => {

    cy.visit('http://localhost:5173/login');

    cy.get('input[name="username"]').type('user2');
    cy.get('input[name="password"]').type('senha123');
    cy.get('button[type="submit"]').click();

    // Verifica se foi redirecionado para a página inicial ou outra página relevante
    cy.url().should('include', '/');

    cy.wait(1000);

    cy.get('input[type="text"]').type('Moby Dick');
    cy.wait(1000);

    cy.get('button').contains('Entrar na fila de reserva').first().click();
    cy.wait(2000);

    cy.on('window:alert', (alertText) => {
      expect(alertText).to.equal('Você foi adicionado à fila para este livro. Sua posição atual é 1');
    });
  });
});




