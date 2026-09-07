/// <reference types="cypress" />

describe("Erweiterte Suche", () => {
  beforeEach(() => {
    cy.visitApp();
  });

  it("behält Originaldaten nach Abbruch des Bearbeitens", () => {
    const title = `Cancel Test ${Date.now()}`;
    const description = "Originalbeschreibung";

    cy.openAddGameForm();

    cy.fillGameForm({
      title,
      description,
      releaseDate: "2020-01-01",
    });

    cy.intercept("POST", "/api/games").as("createGame");

    cy.get(".game-form__btn--submit").click();

    cy.wait("@createGame");

    cy.contains(".game-card", title).within(() => {
      cy.get(".game-card__btn--edit").click();
    });

    cy.fillGameForm({
      title: "Neuer Titel",
      description: "Beschreibung neu",
    });

    cy.get(".game-form__btn--cancel").click();

    cy.contains('.game-card', title).within(() => {
        cy.get('.game-card__title')
        .should('contain.text', title);

        cy.get('.game-card__description')
        .should('contain.text', description);
    });

    cy.deleteGameByTitle(title);
  });

  it("zeigt No Image bei ungültiger Bild-URL", () => {
    const title = `No Image ${Date.now()}`;

    cy.openAddGameForm();

    cy.fillGameForm({
      title,
      description: "Kein Bild",
      imageUrl: "https://falscheUrl.wrong/test.jpg",
      releaseDate: "2020-01-01",
    });

    cy.intercept("POST", "/api/games").as("createGame");

    cy.get(".game-form__btn--submit").click();

    cy.wait("@createGame");

    cy.contains('.game-card', title).within(() => {
        cy.contains('No Image')
            .should('be.visible');

        cy.get('img')
            .should('not.exist');
    });
    cy.deleteGameByTitle(title);
  });

  it("Zeigt No Image wenn keine Bild-URL angegeben wird", () => {
    const title = `No image URL ${Date.now()}`;

    cy.openAddGameForm();

    cy.fillGameForm({
        title,
        description: 'Kein Bild vorhanden',
        imageUrl: '',
        releaseDate: '2020-01-01',
    });

    cy.intercept('POST', '/api/games').as('createGame');

    cy.get('.game-form__btn--submit').click();

    cy.wait('@createGame');

    cy.contains('.game-card', title).within(() => {
        cy.get('.game-card__no-image')
        .should('be.visible');

        cy.contains('No image')
        .should('be.visible');

        cy.get('img')
        .should('not.exist');
    });

    cy.deleteGameByTitle(title);
  });
});
