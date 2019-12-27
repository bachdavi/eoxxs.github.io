@def title = "Talks"
@def hascode = false
@def hasmath = false

# Talks

## Right Inside the Database
[RustFest 2019](https://barcelona.rustfest.eu/sessions/right-inside-the-database),
[Video](https://www.youtube.com/watch?v=6aTXW5mOlj4&feature=youtu.be),
\file{Slides}{/assets/pages/talks/rustfest.pdf}

Modern, stateful web applications are increasingly dependent on
high-frequency updates from multiple database systems. Each
application maintains its own dynamic view of shared and private
data. What if querying and synchronizing this state consistently was
as simple as writing a Datalog query?

Using a reactive query engine powered by differential computation
built in Rust, we explore this question. We present a novel
architecture that selectively and incrementally replicates state
between server and application and thus allows you to develop as if
you were sitting right inside of the database.

## Reaktive Queries über Verteilte Real-Time Data Streams
[BuildingIot
2019](https://www.buildingiot.de/2019/veranstaltung-7795-reaktive-queries-%C3%BCber-verteilte-real-time-data-streams.html),
\file{Slides}{/assets/pages/talks/biot.pdf}

Eine zentrale Herausforderung von IoT-Anwendungen ist die Auswertung
von hochdynamischen Data Streams in Real-Time. Vor dem Hintergrund
klassischer Data-Pipelines stellen wir eine Dataflow-Architektur vor,
mit der Data Streams korrekt, effizient und schnell verarbeitet werden
können. Unsere Architektur erlaubt es, komplexe, aufeinander
aufbauende high-level Queries über heterogene Datenquellen zu stellen,
die mit dem Eintreffen neuer Daten inkrementell aktualisiert werden
und den Anfragesteller reaktiv über neue Ergebnisse
informieren. Ereignisse können dabei bis auf die Nanosekunde genau
aggregiert werden.


