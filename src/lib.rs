mod draw_point;
//mod template;
mod utils;

use draw_point::{smooth_lines_through, Point2};
use js_sys::Array;
//use template::spec::CharacterBase;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn test(src_points: Array) -> Array {
    let mut points: Vec<Point2> = vec![];

    for i in 0..src_points.length() {
        points.push(
            src_points
                .get(i)
                .into_serde::<Point2>()
                .expect("Needs an array of number tuples!"),
        );
    }

    smooth_lines_through(points)
        .into_iter()
        .map(JsValue::from)
        .collect()
}
