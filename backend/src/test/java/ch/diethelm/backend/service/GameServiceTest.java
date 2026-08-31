package ch.diethelm.backend.service;

import ch.diethelm.backend.model.Game;
import ch.diethelm.backend.repository.GameRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GameServiceTest {

    @Mock
    private GameRepository gameRepository;

    @InjectMocks
    private GameService gameService;

    private Game sampleGame(Long id, String title) {
        return Game.builder()
            .id(id)
            .title(title)
            .description("Description from " + title)
            .imageUrl("https:://example.com/" + id + ".jpg")
            .releaseDate(LocalDate.of(2020, 1, 15))
            .build();
    }

    private List<Game> getGameList(){
        return List.of(
            sampleGame(1L, "It takes two"),
            sampleGame(2L, "Red Dead Redemption")
        );
    }

    @Test
    void getAllGames_returnsListFromRepository(){
        List<Game> games = getGameList();
        when(gameRepository.findAll()).thenReturn(games);

        List<Game> result = gameService.getAllGames();

        assertThat(result).hasSize(2);
        assertThat(result).isEqualTo(games);

        verify(gameRepository).findAll();
    }

    @Test
    void getGameById_returnsGameWithId(){
        Game game = sampleGame(1L, "It takes two");
        when(gameRepository.findById(1L)).thenReturn(Optional.of(game));

        Game result = gameService.getGameById(1L);

        assertThat(result).isEqualTo(game);
        verify(gameRepository).findById(1L);
    }

    @Test
    void getGameById_throwsExceptionWhenIdNotFound() {
        
        when(gameRepository.findById(77L)).thenReturn(Optional.empty());
 
        assertThatThrownBy(() -> gameService.getGameById(77L))
                .isInstanceOf(NoSuchElementException.class);
    }

    @Test
    void createGame_returnsGame(){
        Game newGame = sampleGame(null, "It takes two");
        Game savedGame = sampleGame(1L, "it takes two");

        when(gameRepository.save(newGame)).thenReturn(savedGame);

        Game result = gameService.createGame(newGame);

        assertThat(result.getId()).isEqualTo(1L);
        verify(gameRepository).save(newGame);
    }

    @Test
    void updateGame_OverwritesAllFields(){
        Game game = sampleGame(1L, "It takes two");
        Game updatedGame = Game.builder()
        .id(1L)
        .title("Red Dead Redemption")
        .releaseDate(LocalDate.of(2007, 2, 27))
        .description("New description")
        .imageUrl("https://google.com/image.jpg")
        .build();

        when(gameRepository.findById(1L)).thenReturn(Optional.of(game));
        when(gameRepository.save(game)).thenReturn(game);

        Game result = gameService.updateGame(1L, updatedGame);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getTitle()).isEqualTo("Red Dead Redemption");
        assertThat(result.getReleaseDate()).isEqualTo(LocalDate.of(2007, 2, 27));
        assertThat(result.getDescription()).isEqualTo("New description");

        assertThat(result.getImageUrl()).isEqualTo("https://google.com/image.jpg");
            verify(gameRepository).save(game);
    }

    @Test
    void updateGame_throwsExceptionWhenIdNotFound() {
       
        Game game = sampleGame(1L, "It takes two");
        when(gameRepository.findById(77L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> gameService.updateGame(77L,game ))
                .isInstanceOf(NoSuchElementException.class);
    }
 
    @Test
    void deleteGame_deletesGame(){
 
        when(gameRepository.existsById(1L)).thenReturn(true);
 
         gameService.deleteGame(1L);

        verify(gameRepository).existsById(1L);
        verify(gameRepository).deleteById(1L);
    }
 
    @Test
    void deleteGame_throwsExceptionWhenIdNotFound() {
        
        when(gameRepository.existsById(77L)).thenReturn(false);

        assertThatThrownBy(() -> gameService.deleteGame(77L))
            .isInstanceOf(NoSuchElementException.class);
    }

    @Test
    void searchByTitle_delegatesTo_findByTitleContainingIgnoreCase(){
        List<Game> games = List.of(sampleGame(1L, "it takes two"));

        when(gameRepository.findByTitleContainingIgnoreCase("takes")).thenReturn(games);

        List<Game> result = gameService.searchByTitle("takes");

        verify(gameRepository).findByTitleContainingIgnoreCase("takes");
    }

}