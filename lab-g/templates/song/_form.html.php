<?php
/** @var $song ?\App\Model\Song */
?>
<div class="form-group">
    <label for="title">Title</label>
    <input type="text" id="title" name="song[title]" value="<?= $song ? $song->getTitle() : '' ?>">
</div>

<div class="form-group">
    <label for="artist">Artist</label>
    <input type="text" id="artist" name="song[artist]" value="<?= $song ? $song->getArtist() : '' ?>">
</div>

<div class="form-group">
    <label for="content">Review</label>
    <textarea id="content" name="song[content]"><?= $song ? $song->getContent() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>