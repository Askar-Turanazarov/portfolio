# Street scene textures

All PBR texture sets in `tex/` come from [Poly Haven](https://polyhaven.com/textures) and are
released under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). They were downloaded
at 1K resolution and converted to WebP (`-col` = diffuse, `-nrm` = OpenGL normal, `-rgh` = roughness).

| Files | Poly Haven asset |
|---|---|
| `brick-*` | [red_brick_03](https://polyhaven.com/a/red_brick_03) |
| `plaster-*` | [plastered_wall_02](https://polyhaven.com/a/plastered_wall_02) |
| `wood-*` | [weathered_planks](https://polyhaven.com/a/weathered_planks) |
| `pavers-*` | [concrete_pavers](https://polyhaven.com/a/concrete_pavers) |
| `asphalt-*` | [asphalt_02](https://polyhaven.com/a/asphalt_02) |
| `shutter-*` | [painted_metal_shutter](https://polyhaven.com/a/painted_metal_shutter) |
| `metal-*` | [metal_plate_02](https://polyhaven.com/a/metal_plate_02) |

Everything else in the scene (majolica, signs, windows, bark, leaves, grass, clouds) is drawn
procedurally at runtime with the Canvas 2D API.
