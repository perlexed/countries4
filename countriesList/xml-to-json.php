<?php

// https://www.artlebedev.ru/country-list/xml/
$xmlContent = file_get_contents(__DIR__ . '/countries.xml');

$countriesXml = new SimpleXMLElement($xmlContent);

$countriesData = [];

foreach ($countriesXml->country as $country) {
    $countriesData[] = [
        'name' => trim((string) $country->name),
        'fullName' => trim((string) $country->fullname),
        'code' => trim((string) $country->alpha3),
    ];
}

file_put_contents(__DIR__ . '/countries.json', json_encode($countriesData, JSON_UNESCAPED_UNICODE));
