/// <reference types="cypress" />


describe("Fehlerbehandlung", () => {
  beforeEach(() => {
    cy.visitApp();
  });

  it('Zeigt eine Fehlermeldung bei einem Serverfehler beim initialen Laden', () => {

    cy.intercept('GET', '/api/games', {
      statusCode: 500,
      body: {
        message: 'Internal Server Error'
      }
    }).as('getGames');

    cy.visitApp();

    cy.wait('@getGames');

    cy.get('.home-page__error')
    .should('be.visible');
  });

  it('Zeigt eine Fehlermeldung bei einem Serverfehler während der Suche', () => {
    
    cy.intercept('GET', '/api/games/search*', {
      statusCode: 500,
      body: {
        message: 'Search failed'
      }
    }).as('search');

    cy.get('.search-bar__input')
    .type('Mario');

    cy.get('.search-bar__button')
    .click();

    cy.wait('@search');

    cy.get('.home-page__error')
      .should('be.visible');
  });

  it('Zeigt das neue Spiel bei einem Netzwerkfehler nicht an', () => {
    
    const title = `Network Error Test ${Date.now()}`;

    cy.openAddGameForm();

    cy.fillGameForm({
      title,
      description: 'Test für Netzwerkfehler',
      releaseDate: '2024-01-01',
    });

    cy.intercept('POST', '/api/games', {
      forceNetworkError: true
    }).as('createGame');

    cy.get('.game-form__btn--submit')
    .click();

    cy.wait('@createGame');

    cy.contains('.game-card__title', title)
    .should('not.exist');

    cy.get('.home-page__error')
    .should('be.visible');

  });
});