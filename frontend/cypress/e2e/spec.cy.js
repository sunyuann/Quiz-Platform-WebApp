describe('Admin Happy Path', () => {
  const cy = window.cy;
  it('Visit login page', () => {
    cy.visit('http://localhost:3000/');
    cy.contains('button', 'Sign In').should('exist');
  })

  it('Register, Create new game, Start game, End game, Load results, Log out, Log in', () => {
    const email = `hello@there.com${Math.random().toString()}`;
    const password = 'password123';
    cy.visit('http://localhost:3000/');
    // Register
    cy.contains('Sign Up').click();
    cy.get('input[name="email"]').focus().type(email);
    cy.get('input[name="password"]').focus().type(password);
    cy.get('input[name="name"]').focus().type('fmrekglaermgv');
    cy.contains('button', 'Sign Up').click();
    cy.contains('Dashboard').should('exist');
    // Create new Game
    const quizName = 'me quizzy';
    cy.contains('Show').click();
    cy.get('input[name="new-quiz-name"]').focus().type(quizName);
    cy.contains('Create new game').click();
    cy.contains('b', quizName).should('exist');
    // Start game
    cy.contains('button', 'Start').click();
    // cy.contains('button', 'Copy URL').click();
    /* cy.get('p').then((p) => {
      cy.window().then((win) => {
        win.navigator.clipboard.readText().then((cbtext) => {
          expect(cbtext).to.contain(p.text());
        })
      })
    }) */
    cy.contains('button', 'Close').click();
    cy.contains('button', 'Stop').should('exist');
    // End game
    cy.contains('button', 'Control Panel').click();
    cy.contains('button', 'Start Quiz').click();
    // Check results
    cy.contains('h2', 'Top 5 Players').should('exist');
    // Log out
    cy.contains('button', 'Logout').click();
    cy.contains('button', 'Sign In').should('exist');
    // Log in
    cy.get('input[name="email"]').focus().type(email);
    cy.get('input[name="password"]').focus().type(password);
    cy.contains('button', 'Sign In').click();
    cy.contains('Dashboard').should('exist');
  });
})
