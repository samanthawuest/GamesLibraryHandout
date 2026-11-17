package ch.diethelm.backend;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class TitleNormalizerTest {
    @Test
    void normalize_trimsSurroundingSpaces() {
        assertEquals("Zelda", TitleNormalizer.normalize(" Zelda "));
    }
}
