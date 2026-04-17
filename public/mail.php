<?php
/**
 * @package GIALLORO-FIRENZE — Mail backend
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — GIALLORO-FIRENZE)
 * @date 2026-04-17
 * @purpose Form contatti endpoint. Honeypot + rate-limit IP + SMTP via mail().
 *          Config SMTP server-side: leggere da /etc/giallo-oro-mail.env se presente.
 *          Risposte JSON per fetch async, redirect HTML per fallback no-JS.
 */

declare(strict_types=1);

// --- CONFIG ---------------------------------------------------------------
const MAIL_TO         = 'info@gialloorofirenze.it';
const MAIL_FROM       = 'noreply@gialloorofirenze.it';
const MAIL_SUBJECT    = '[Giallo Oro] Nuova richiesta dal sito';
const RATE_LIMIT_DIR  = '/tmp/gialloro-rate-limit';
const RATE_LIMIT_MAX  = 3;          // max invii
const RATE_LIMIT_WIN  = 3600;       // finestra 1h

// --- UTILS ----------------------------------------------------------------
function respond(bool $ok, string $message, int $code = 200): void {
    $isAjax = isset($_SERVER['HTTP_ACCEPT']) && str_contains($_SERVER['HTTP_ACCEPT'], 'application/json');
    if ($isAjax) {
        http_response_code($code);
        header('Content-Type: application/json');
        echo json_encode(['ok' => $ok, 'message' => $message]);
        exit;
    }
    $locale = $_POST['_locale'] ?? 'it';
    $base = $locale === 'en' ? '/en/contact' : '/contatti';
    $flag = $ok ? '?sent=1' : '?error=1';
    header('Location: ' . $base . $flag);
    exit;
}

function clean(string $v, int $max = 500): string {
    $v = trim($v);
    $v = strip_tags($v);
    $v = preg_replace('/[\r\n]+/', ' ', $v) ?? '';
    return mb_substr($v, 0, $max);
}

function validEmail(string $e): bool {
    return (bool) filter_var($e, FILTER_VALIDATE_EMAIL);
}

// --- ENTRY ----------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Method not allowed', 405);
}

// Honeypot: campo "website" deve essere vuoto
if (!empty($_POST['website'] ?? '')) {
    // Finta conferma per non dare info ai bot
    respond(true, 'OK');
}

// Nonce base: presenza + lunghezza minima (HMAC-free per semplicità)
$nonce = $_POST['_nonce'] ?? '';
if (!is_string($nonce) || strlen($nonce) < 8) {
    respond(false, 'Richiesta non valida', 400);
}

// Rate-limit per IP (file-based)
if (!is_dir(RATE_LIMIT_DIR)) { @mkdir(RATE_LIMIT_DIR, 0700, true); }
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ipHash = hash('sha256', $ip);
$rlFile = RATE_LIMIT_DIR . '/' . $ipHash;
$now = time();
$attempts = [];
if (is_file($rlFile)) {
    $raw = @file_get_contents($rlFile);
    $attempts = $raw ? (json_decode($raw, true) ?: []) : [];
    $attempts = array_filter($attempts, fn($t) => ($now - (int)$t) < RATE_LIMIT_WIN);
}
if (count($attempts) >= RATE_LIMIT_MAX) {
    respond(false, 'Troppe richieste. Riprova tra un\'ora.', 429);
}

// Validazione campi
$name    = clean($_POST['name']    ?? '', 120);
$email   = clean($_POST['email']   ?? '', 180);
$phone   = clean($_POST['phone']   ?? '', 40);
$subject = clean($_POST['subject'] ?? '', 200);
$message = clean($_POST['message'] ?? '', 2000);
$privacy = !empty($_POST['privacy'] ?? '');

if (strlen($name) < 2)          respond(false, 'Nome troppo corto', 422);
if (!validEmail($email))        respond(false, 'Email non valida', 422);
if (strlen($subject) < 2)       respond(false, 'Oggetto mancante', 422);
if (!$privacy)                  respond(false, 'Consenso privacy obbligatorio', 422);

// Compose
$body = "Nuova richiesta da gialloorofirenze.it\n\n"
      . "Nome:     $name\n"
      . "Email:    $email\n"
      . "Telefono: $phone\n"
      . "Oggetto:  $subject\n\n"
      . "Messaggio:\n$message\n\n"
      . "-- \n"
      . "IP (hash): " . substr($ipHash, 0, 12) . "\n"
      . "Data: " . date('Y-m-d H:i:s') . "\n"
      . "UA: " . clean($_SERVER['HTTP_USER_AGENT'] ?? '-', 300) . "\n";

$headers = [
    'From'         => 'Giallo Oro Firenze <' . MAIL_FROM . '>',
    'Reply-To'     => "$name <$email>",
    'X-Mailer'     => 'gialloorofirenze.it',
    'Content-Type' => 'text/plain; charset=UTF-8',
    'MIME-Version' => '1.0',
];
$headerStr = '';
foreach ($headers as $k => $v) { $headerStr .= "$k: $v\r\n"; }

// Send
$sent = @mail(MAIL_TO, MAIL_SUBJECT . ' — ' . $subject, $body, $headerStr);

// Track rate-limit anche su successo
$attempts[] = $now;
@file_put_contents($rlFile, json_encode(array_values($attempts)));

if (!$sent) {
    error_log('[gialloro] mail() failed for ' . substr($ipHash, 0, 12));
    respond(false, 'Errore invio. Contattaci via WhatsApp o telefono.', 500);
}

respond(true, 'Richiesta inviata. Ti ricontattiamo a breve.');
