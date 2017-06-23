# DVI-Kelricks-odyssey
Game developed for the subjet *Videogame Development through Web Tecnologies* (DVI)

Inspired by [The Legend of Zelda](https://en.wikipedia.org/wiki/The_Legend_of_Zelda) video game series

Developed at 2016-2017 by the Computers Science Degree (Complutense University of Madrid) students:

* [Hector Malagón Roldán](https://github.com/HectorMalagon)
* [Jose Miguel Tajuelo Garrigós](https://github.com/J-888)

# Diseño del juego

## Ficha de juego
| | |
| ----------- | ----------------- |
| TÍTULO      | Kelrick’s Odyssey |
| GÉNERO      | Acción-aventura   |
| PLATAFORMAS | PC, móviles       |
| MODOS       | Un jugador        |
| EDAD        | +7                |

## Descripción
Kelrick’s Odyssey es un juego Top-Down en el que controlaras a Kelrick, un héroe que explorará un misterioso bosque en busca de aventuras, defendiéndose de los peligros que encuentre y recogiendo objetos especiales que le permitirán adentrarse más en su aventura y poder derrotar a sus enemigos.

## Ambientación
Kelrick es un joven héroe que se aventura por un extenso bosque lleno de peligros, magia y tesoros. Poco a poco irá aumentando la dificultad según se acerque a la fase final del juego, que se encontrará en una profunda cueva donde le espera un temible enemigo.

## Objetivo
El objetivo del jugador es explorar los diversos escenarios (bosque y cuevas), pasando al escenario siguente al atravesar puertas y cavidades, hasta encontrar al jefe final y derrotarle. 

Los cofres actuan como bonus, facilitando esta exploracion al otorgar al jugador nuevos objetos o aumentando su cantidad de vida.

los enemigos tratan de golpear al jugador, reduciendo su cantidad de vida hasta que esta llega a cero y se pierde la partida.

## Mecanicas centrales
Kelrick posee ataques con la espada direccionales, asi como la posibilidad de portar ilimitados items, como:
  * Puede obtener un escudo que le ayudará a deflectar distintos ataques de los enemigos. Este objeto puede ser usado constantemente.
  * Puede obtener un arco que puede disparar hacia una dirección, con la ventaja de rango ilimitado, pero un daño bastante inferior a la espada. Este objeto no puede ser usado constantemente, ya que posee un tiempo de *cooldown*.
  * Puede obtener una bomba arrojadiza que lanzará a una zona, y tras unos segundos explotará haciendo daño de área. Este objeto no puede ser usado constantemente, ya que posee un tiempo de *cooldown*.
  * Puede obtener de fuego y otro de hielo, funcionalidad parecida al arco, con mayor daño y menor velocidad de proyectil. Este objeto no puede ser usado constantemente, ya que posee un tiempo de *cooldown*.
  * Algunas de estas habilidades son necesarias para vencer algunos enemigos, siendo estos invulnerables a otras.

Exixten diversos tipos de enemigos, variando su velocidad, ataque y la forma de enfrentarse al jugador: acercarse directamente y atacar cuerpo a cuerpo, alejarse y atacar a distancia, etc.

Existen 3 fases en el juego
 * Nivel en el bosque
 * Tres niveles en cuevas generadas proceduralente, cada uno de mayor tamaño y dificultad que las anteriores
 * Enfrentamiento al jefe final

Además, el juego contiene numerosas mecanicas menores, como un sistema de *knockback*

## Referentes
The Legend of Zelda Series

## Riesgos
  * No terminar a tiempo todas las habilidades para el personaje.
  * No realizar a tiempo una cueva o bosque demasiado extensos.
  * No lograr una diferencia significativa entre los diferentes enemigos

# Diseño de la implementación
Para realizar la implementación del proyecto hemos empleado el motor Quintus, realizando cambios internos en este para incluir un sistema de control (*topDownControls*) que se adaptase a nuestras necesitades. Ademas, hemos añadido un jugador, con una serie de atributos relaccionados con el inventario y el estado del jugador, asi como una serie de enemigos, extrayendo todo el codigo comun en un componente (*defaultEnemy*). Además, al existir numerosos proyectiles que comparten un comportamiento basico, lo hemos implementado como otro componente (*projectile*). Tambien hemos realizado la implementacion de dos inteligencias arficiales basadas en arboles de decision (*AIshooter* y *AIchaser*), consistentes en la realizacion de una una acción en función de una serie de condiciones del estado del juego (a cada *step*). Por ultimo, hemos adaptado la libreria *rot.js* para generar un sistema de cuevas procedural, obteniendo de esta libreria un "mapa" de 0s y 1s, eliminando nosotros todas las posibles imperfecciones de este, pintando esta cueva mediante *sprites* de paredes individuales y colocando al jugador, a los enemigos, cofres y la cavidad/puerta al siguiente nivel de forma automática.

# Equipo de trabajo y reparto de tareas
El equipo de trabajo del proyecto ([Hector Malagón Roldán](https://github.com/HectorMalagon) y [Jose Miguel Tajuelo Garrigós](https://github.com/J-888)) consideramos que hemos realizado una trabajo identica (50% y 50%), debido a que practicamente todo el trabajo se ha realizado mediante el método de *pair programming*, tanto de manera presencial como por videoconferencia. no obstante,  excepciones a este metodo han sido la depuración del proyecto, el estudio de tecnicas procedurales y la busqueda de fuentes audiovisuales, que hemos realizado (si bien de forma separada) ambos miembros del equipo, realizando cantidades de trabajo equivalentes.

# Fuentes y referencias
Jugador y numerosos objetos:
  * [Sheet 1](http://spritedatabase.net/file/6037)
  * [Sheet 2](https://www.spriters-resource.com/game_boy_advance/thelegendofzeldatheminishcap/sheet/6369/)
 
Sprites de cada nivel:
  * [Bosque](https://opengameart.org/content/zelda-like-tilesets-and-sprites)
  * [Cueva](https://opengameart.org/content/cave-tileset-0)

Enemigos:
  * [Octorok](http://spritedatabase.net/file/6048)
  * [Skull](https://www.spriters-resource.com/custom_edited/thelegendofzeldacustoms/sheet/17337/)
  * [Boss](http://updates.themanaworld.net/client-data/graphics/sprites/monsters/?C=M;O=A)
 
Objetos adicionales:
  * [Items cofre](http://pixeljoint.com/files/icons/full/minecraft_items_big.png)
 
[Fuentes](https://zeldauniverse.net/media/fonts/)

[Iconos HUD](http://reklino.github.io/zeldicons/)

Imagenes de fondos (modificadas por nosotros):
  * [Main Menu](https://farm9.staticflickr.com/8345/8228709224_11d6fc2824.jpg)
  * [Secondary Menu](http://img14.deviantart.net/6d15/i/2016/118/4/9/misty_forest_by_doneofficial-da0jrwc.png)
  * [Game Over](http://wallpaperpulse.com/wallpaper/1239951)
  * [End](http://blog.paleohacks.com/wp-content/uploads/2013/02/PaleoHacks-About-Page.jpg)
  
[rot.js](http://ondras.github.io/rot.js/hp/) para la [generacion procedural de cuevas](http://j-888.me/DVI-Kelricks-odyssey/procedural_cave_demo)(para la que hemos requerido la experimentacion con numerosos parametros)
