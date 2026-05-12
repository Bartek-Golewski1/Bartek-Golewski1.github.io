<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Konwerter Formatów PTW</title>
</head>
<body>
<form method="POST">
    <div>
        <label for="input_format">Format wejściowy:</label>
        <select name="input_format" id="input_format">
            <?php foreach (['csv', 'ssv', 'tsv', 'json', 'yaml'] as $fmt): ?>
                <option value="<?= $fmt ?>" <?= $inputFormat === $fmt ? 'selected' : '' ?>><?= strtoupper($fmt) ?></option>
            <?php endforeach; ?>
        </select>

        <label for="output_format">Format wyjściowy:</label>
        <select name="output_format" id="output_format">
            <?php foreach (['csv', 'ssv', 'tsv', 'json', 'yaml'] as $fmt): ?>
                <option value="<?= $fmt ?>" <?= $outputFormat === $fmt ? 'selected' : '' ?>><?= strtoupper($fmt) ?></option>
            <?php endforeach; ?>
        </select>
    </div>
    <br>
    <div>
        <textarea name="input_data" rows="15" cols="50"><?= htmlspecialchars($inputData) ?></textarea>
    </div>
    <br>
    <button type="submit">Convert</button>
</form>

<hr>

<?php if (!empty($outputData)): ?>
    <h3>Wynik konwersji:</h3>
    <pre><?= htmlspecialchars($outputData) ?></pre>
<?php endif; ?>
</body>
</html>