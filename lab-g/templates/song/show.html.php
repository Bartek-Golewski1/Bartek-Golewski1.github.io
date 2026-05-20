<?php

/** @var \App\Model\Song $song */
/** @var \App\Service\Router $router */

$title = $song->getTitle();
$bodyClass = "show";

ob_start(); ?>
    <h1><?= $song->getTitle() ?> — <?= $song->getArtist() ?></h1>
    <div class="content"><?= nl2br(htmlspecialchars($song->getContent())) ?></div>

    <a href="<?= $router->generatePath('song-index') ?>">Back to list</a>
    <a href="<?= $router->generatePath('song-edit', ['id' => $song->getId()]) ?>">Edit</a>
    <a href="<?= $router->generatePath('song-delete', ['id' => $song->getId()]) ?>">Delete</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';