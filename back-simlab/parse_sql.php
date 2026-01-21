<?php

/**
 * Script untuk parse SQL file dan extract data alat & bahan laboratorium
 * Menggunakan full parsing tanpa regex untuk extraksi VALUES (menghindari masalah semicolon dalam string)
 */

echo "=== SQL Parser - Extract Laboratory Data ===\n\n";

$sqlFile = 'D:\\Github-ADL\\simlab2\\simlab_terpadu (2).sql';

if (!file_exists($sqlFile)) {
    die("ERROR: File SQL tidak ditemukan: $sqlFile\n");
}

ini_set('memory_limit', '512M');

echo "Membaca file SQL...\n";
$content = file_get_contents($sqlFile);
echo "File size: " . number_format(strlen($content)) . " bytes\n\n";

function extractTableData($content, $tableName)
{
    echo "Processing table: $tableName...\n";

    // Find extraction start
    // Note: Search specifically for INSERT INTO `table`
    $search = "INSERT INTO `$tableName`";
    $pos = strpos($content, $search);

    if ($pos === false) {
        echo "✗ Could not find INSERT statement for $tableName\n";
        return [];
    }

    // Move pos to after matches
    $pos += strlen($search);

    // Find start of VALUES
    $valuesTags = ['VALUES', 'values'];
    $foundValues = false;
    $startValues = 0;

    // Search forward for "VALUES"
    // We limit search to avoiding scanning whole file
    $chunk = substr($content, $pos, 1000);
    // Wait, between INSERT and VALUES there are columns (...)
    // We need to parse columns first

    $openParen = strpos($content, '(', $pos);
    $closeParen = strpos($content, ')', $openParen);

    if ($openParen === false || $closeParen === false) {
        echo "✗ Could not parse columns for $tableName\n";
        return [];
    }

    $columnsString = substr($content, $openParen + 1, $closeParen - $openParen - 1);
    preg_match_all('/`([^`]+)`/', $columnsString, $matches);
    $columnNames = $matches[1];

    echo "Columns: " . implode(', ', $columnNames) . "\n";

    $pos = $closeParen + 1;

    // Now find VALUES
    $valuesPos = stripos($content, 'VALUES', $pos);
    if ($valuesPos === false) {
        echo "✗ Could not find VALUES keyword\n";
        return [];
    }

    $pos = $valuesPos + 6; // Length of VALUES

    // Start parsing values
    $rows = [];
    $currentRow = [];
    $currentVal = '';
    $inString = false;
    $escaped = false;
    $inRow = false;

    $len = strlen($content);

    // We scan carefully
    for ($i = $pos; $i < $len; $i++) {
        $char = $content[$i];

        if (!$inRow) {
            // Check for terminator ;
            if (!$inString && $char === ';') {
                echo "Found terminator at offset $i. Stopping.\n";
                break;
            }

            if ($char === '(') {
                $inRow = true;
                $currentRow = [];
                $currentVal = '';
                $inString = false;
                $escaped = false;
            } else {
                // Ignore whitespace, comments?
                // For simplified parsing, we assume standard dump format
            }
            continue;
        }

        // Inside a row (...)
        if ($inString) {
            if ($escaped) {
                $currentVal .= $char;
                $escaped = false;
            } elseif ($char === '\\') {
                // MySQL dump escaping
                $nextChar = $i + 1 < $len ? $content[$i + 1] : '';
                if ($nextChar === "'" || $nextChar === '"' || $nextChar === '\\') {
                    $escaped = true;
                } else {
                    $currentVal .= $char;
                }
            } elseif ($char === "'") {
                $inString = false;
            } else {
                $currentVal .= $char;
            }
        } else {
            // Not in string
            if ($char === "'") {
                $inString = true;
            } elseif ($char === ',') {
                $val = trim($currentVal);
                if (strtoupper($val) === 'NULL') {
                    $val = null;
                }
                $currentRow[] = $val;
                $currentVal = '';
            } elseif ($char === ')') {
                // End of row
                $val = trim($currentVal);
                if ($currentVal !== '' || isset($currentRow[count($columnNames) - 1])) {
                    if (strtoupper($val) === 'NULL') {
                        $val = null;
                    }
                    $currentRow[] = $val;
                }

                // Map
                $mappedRow = [];
                foreach ($columnNames as $k => $colName) {
                    $mappedRow[$colName] = $currentRow[$k] ?? null;
                }
                $rows[] = $mappedRow;

                $inRow = false;
            } else {
                if (trim($char) !== '') {
                    $currentVal .= $char;
                }
            }
        }
    }

    return $rows;
}

// Extract Rooms
$rooms = extractTableData($content, 'ruangan_laboratorium');
$roomFile = __DIR__ . '/room_data.json';
file_put_contents($roomFile, json_encode($rooms, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
echo "✓ Extracted " . count($rooms) . " rooms\n\n";

// Extract Equipment
$equipments = extractTableData($content, 'alat_laboratorium');
$equipmentFile = __DIR__ . '/equipment_data.json';
file_put_contents($equipmentFile, json_encode($equipments, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
echo "✓ Extracted " . count($equipments) . " equipment\n\n";

// Extract Materials
$materials = extractTableData($content, 'bahan_laboratorium');
$materialFile = __DIR__ . '/material_data.json';
file_put_contents($materialFile, json_encode($materials, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
echo "✓ Extracted " . count($materials) . " materials\n\n";

echo "=== DONE ===\n";
