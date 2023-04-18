describe('Admin Happy Path', () => {
  const cy = window.cy;
  it('Visit login page', () => {
    cy.visit('http://localhost:3000/');
    cy.contains('button', 'Log In').should('exist');
  })

  it('Register, Create new game, Start game, End game, Load results, Log out, Log in', () => {
    const email = `hello@there.com${Math.random().toString()}`;
    const password = 'password123';
    cy.visit('http://localhost:3000/');
    // Register
    cy.contains('Sign Up').click();
    cy.get('input[placeholder="Enter Email here"]').focus().type(email);
    cy.get('input[placeholder="Enter Password here"]').focus().type(password);
    cy.get('input[placeholder="Enter Name here"]').focus().type('fmrekglaermgv');
    cy.contains('button', 'Register').click();
    cy.contains('Dashboard').should('exist');
    // Create new Game
    const quizName = 'me quizzy';
    cy.contains('Click here to').click();
    cy.get('input[placeholder="Enter game name here"]').focus().type(quizName);
    cy.contains('button', 'Create new game').click();
    cy.contains('b', quizName).should('exist');
    // Start game
    cy.contains('button', 'Start').click();
    cy.contains('button', 'Close').click();
    cy.contains('button', 'Stop').should('exist');
    // End game
    cy.contains('button', 'Control Panel').click();
    cy.contains('button', 'Start Quiz').click();
    // Check results
    cy.contains('h2', 'Top 5 Players').should('exist');
    // Log out
    cy.contains('button', 'Logout').click();
    cy.contains('button', 'Log In').should('exist');
    // Log in
    cy.get('input[placeholder="Enter Email here"]').focus().type(email);
    cy.get('input[placeholder="Enter Password here"]').focus().type(password);
    cy.contains('button', 'Log In').click();
    cy.contains('Dashboard').should('exist');
  });
})

describe('Admin/User Path', () => {
  const cy = window.cy;
  it('Create Quiz, Add Question, Edit Question, Add Answer, Test BackButton, Start Quiz, Join Game', () => {
    const email = `hello@there.com${Math.random().toString()}`;
    const password = 'password123';
    cy.visit('http://localhost:3000/');
    // Register
    cy.contains('Sign Up').click();
    cy.get('input[placeholder="Enter Email here"]').focus().type(email);
    cy.get('input[placeholder="Enter Password here"]').focus().type(password);
    cy.get('input[placeholder="Enter Name here"]').focus().type('fmrekglaermgv');
    cy.contains('button', 'Register').click();
    cy.contains('Dashboard').should('exist');
    // Create new Game
    const quizName = 'me quizzy';
    cy.contains('Click here to').click();
    cy.get('input[placeholder="Enter game name here"]').focus().type(quizName);
    cy.contains('button', 'Create new game').click();
    cy.contains('b', quizName).should('exist');
    // Edit game
    cy.contains('button', 'Edit').click();
    // Add new question
    cy.contains('button', 'Add new question').click();
    // Edit question
    cy.contains('button', 'Edit').click();
    cy.contains('button', 'Add new answer').should('exist');
    // Add answer
    cy.get('input[value=""][placeholder="Enter an answer here"]').should('not.exist');
    cy.contains('button', 'Add new answer').click();
    cy.get('input[value=""][placeholder="Enter an answer here"]').should('exist');
    // Save question
    cy.contains('button', 'Save changes').click();
    cy.contains('div', 'Changes saved').should('exist');
    // Test BackButton
    cy.contains('button', 'Back').click();
    cy.contains('button', 'Add new question').should('exist');
    cy.contains('button', 'Back').click();
    cy.contains('Dashboard').should('exist');
    // Start game
    cy.contains('button', 'Start').click();
    cy.contains('button', 'Close').click();
    // Stop game
    cy.contains('button', 'Stop').click();
    // Test other way to results
    cy.contains('button', 'Yes').click();
    cy.contains('h2', 'Top 5 Players').should('exist');
    // Test NavBar Dashboard link
    cy.contains('a', 'Dashboard').click();
    // Start game
    cy.contains('button', 'Start').click();
    // Join game
    cy.get('p[id="game-start-popup-description"]').then((p) => {
      const sessionID = p.text();
      cy.visit(`http://localhost:3000/play/${sessionID}`);
      cy.get(`input[value=${sessionID}]`).should('exist');
      cy.get('input[placeholder="Enter your name here"]').focus().type('bob');
      cy.contains('button', 'Play!').click();
      cy.contains('We are in!').should('exist');
    });
  });
})
