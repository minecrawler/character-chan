use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Debug, Copy, Clone)]
pub struct CharacterBase {
    pub body_height: f32,
    pub chin_height: f32,
    pub chin_to_eyes_height: f32,
    pub eye_height: f32,
    pub face_height: f32,
    pub face_width: f32,
    pub lower_face_height: f32,
    pub mid_face_height: f32,
    pub upper_face_height: f32,
}
