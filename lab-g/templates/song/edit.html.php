<?php

/** @var \App\Model\Song $song */
/** @var \App\Service\Router $router */

$title = 'Edit Song Review';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Edit Song Review</h1>
    <form action="<?= $router->generatePath('song-edit', ['id' => $song->getId()]) ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="song-edit">
    </form>

    <a href="<?= $router->generatePath('song-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';