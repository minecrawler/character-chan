use super::spec::CharacterBase;

impl CharacterBase {
    /// roughly based on Miss Korea
    /// https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4593870/
    pub fn human(scale: f32) -> Self {
        CharacterBase {
            body_height: 1.75 * scale,
            chin_height: 0.012 * scale,
            chin_to_eyes_height: 0.3 * scale,
            eye_height: 0.0,
            face_height: 0.5 * scale,
            face_width: 0.24 * scale,
            lower_face_height: 0.18 * scale,
            mid_face_height: 0.0,
            upper_face_height: 0.12 * scale,
        }
    }
}
