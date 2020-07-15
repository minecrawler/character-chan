use cubic_spline::{Spline, SplineOptsBuilder};
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Debug, Copy, Clone)]
pub struct Point2 {
    pub x: f64,
    pub y: f64,
}

pub fn smooth_lines_through(
    src_points: Vec<Point2>,
    segment_count: u32,
    tension: f64,
) -> Vec<Point2> {
    let opts = SplineOptsBuilder::new()
        .num_of_segments(segment_count)
        .tension(tension)
        .take();

    let points: Vec<(f64, f64)> = src_points.iter().map(|point| (point.x, point.y)).collect();

    Spline::from_tuples(&points, &opts)
        .iter()
        .map(|tuple| Point2 {
            x: tuple.0,
            y: tuple.1,
        })
        .collect()
}
