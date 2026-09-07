/// <reference types="cypress" />

import exp from "constants";

describe("Erweiterte Suche", () => {
  beforeEach(() => {
    cy.visitApp();
  });

  it("verarbeitet Sonderzeichen ohne Absturz", () => {
    cy.intercept("GET", "/api/games/search*").as("search");

    cy.get(".search-bar__input").type("%<&äöü");
    cy.get(".search-bar__button").click();

    cy.wait("@search");

    cy.get("body").then(($body) => {
      const noGamesFound = $body.find(".game-list__status-title").length > 0;

      const gameCards = $body.find(".game-card").length > 0;

      expect(noGamesFound || gameCards).to.be.true;
    });
  });

  it("verarbeitet sehr lange Suchbegriffe ohne Absturz", () => {
    const longSearch = "a".repeat(250);

    cy.intercept("GET", "/api/games/search*").as("search");

    cy.get(".search-bar__input").type(longSearch);
    cy.get(".search-bar__button").click();

    cy.wait("@search");

    cy.get("body").then(($body) => {
      const noGamesFound = $body.find(".game-list__status-title").length > 0;
      const gameCards = $body.find(".game-card").length > 0;

      expect(noGamesFound || gameCards).to.be.true;
    });
  });

  it("löst die Suche erst nach Klick auf den Suchbutton aus", () => {
    cy.get(".game-card")
      .its('length')
      .then((initialCount) => {
        cy.get(".search-bar__input").type(
          "EinSpielDasEsGarantiertNichtGibt12345",
        );

        cy.get(".game-card").should("have.length", initialCount);

        cy.intercept("GET", "/api/games/search*").as("search");

        cy.get(".search-bar__button").click();

        cy.wait("@search");

        cy.get(".game-list__status-title").should(
          "contain.text",
          "No Games found",
        );
      });
  });
});
