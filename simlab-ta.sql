-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 21 Nov 2025 pada 03.54
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `simlab-ta`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `academic_years`
--

CREATE TABLE `academic_years` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` enum('Active','Deactive') NOT NULL DEFAULT 'Deactive',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `academic_years`
--

INSERT INTO `academic_years` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, '2025', 'Active', '2025-11-03 03:59:56', '2025-11-20 08:51:13');

-- --------------------------------------------------------

--
-- Struktur dari tabel `bookings`
--

CREATE TABLE `bookings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `academic_year_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `laboran_id` bigint(20) UNSIGNED DEFAULT NULL,
  `laboratory_room_id` bigint(20) UNSIGNED DEFAULT NULL,
  `phone_number` char(14) NOT NULL,
  `purpose` varchar(255) NOT NULL,
  `supporting_file` varchar(255) DEFAULT NULL,
  `activity_name` varchar(255) NOT NULL,
  `supervisor` varchar(255) DEFAULT NULL,
  `supervisor_email` varchar(255) DEFAULT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `status` enum('draft','pending','approved','rejected','revision','returned') NOT NULL,
  `booking_type` enum('room','room_n_equipment','equipment') NOT NULL,
  `total_participant` int(11) NOT NULL,
  `participant_list` text DEFAULT NULL,
  `is_allowed_offsite` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `bookings`
--

INSERT INTO `bookings` (`id`, `academic_year_id`, `user_id`, `laboran_id`, `laboratory_room_id`, `phone_number`, `purpose`, `supporting_file`, `activity_name`, `supervisor`, `supervisor_email`, `start_time`, `end_time`, `status`, `booking_type`, `total_participant`, `participant_list`, `is_allowed_offsite`, `created_at`, `updated_at`) VALUES
(2, 1, 4, 3, 1, '081213039516', 'Kegiatan', NULL, 'Worker', 'Najib', '10211067@student.itk.ac.id', '2025-11-03 08:00:00', '2025-11-03 17:00:00', 'rejected', 'room', 20, NULL, 0, '2025-11-03 04:02:25', '2025-11-11 07:07:17'),
(3, 1, 4, 3, 1, '081213039516', 'hehehe', NULL, 'Test', 'Najib', '10211067@student.itk.ac.id', '2025-11-04 09:00:00', '2025-11-04 10:00:00', 'approved', 'room_n_equipment', 30, NULL, 0, '2025-11-03 07:38:03', '2025-11-03 07:57:06'),
(4, 1, 4, 3, 1, '081213039516', 'Kegiatan', NULL, 'Worker', 'Najib', 'najibbijan0@gmail.com', '2025-11-03 08:00:00', '2025-11-03 17:00:00', 'returned', 'equipment', 3, NULL, 1, '2025-11-03 09:03:42', '2025-11-04 07:07:03'),
(7, 1, 4, 3, 1, '081213039516', 'Kegiatan', NULL, 'Worker', 'Najib', 'najibbijan0@gmail.com', '2025-11-11 08:00:00', '2025-11-12 17:00:00', 'returned', 'equipment', 20, NULL, 1, '2025-11-11 07:12:11', '2025-11-11 07:23:24'),
(8, 1, 4, 3, 2, '081213039516', 'Kegiatan', NULL, 'Worker', 'Najib', 'najibbijan0@gmail.com', '2025-11-11 08:00:00', '2025-11-13 17:00:00', 'returned', 'equipment', 30, NULL, 0, '2025-11-11 08:31:16', '2025-11-20 07:18:45'),
(9, 1, 4, 3, 1, '081213039516', 'Kegiatan', NULL, 'Test', 'Najib', '10211067@student.itk.ac.id', '2025-11-17 08:00:00', '2025-11-17 17:00:00', 'returned', 'equipment', 10, NULL, 1, '2025-11-17 03:16:54', '2025-11-20 03:14:58');

-- --------------------------------------------------------

--
-- Struktur dari tabel `booking_approvals`
--

CREATE TABLE `booking_approvals` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `booking_id` bigint(20) UNSIGNED NOT NULL,
  `action` enum('request_booking','verified_by_head','verified_by_laboran','returned_by_requestor','return_confirmed_by_laboran') NOT NULL,
  `approver_id` bigint(20) UNSIGNED NOT NULL,
  `is_approved` tinyint(1) NOT NULL,
  `information` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `booking_approvals`
--

INSERT INTO `booking_approvals` (`id`, `booking_id`, `action`, `approver_id`, `is_approved`, `information`, `created_at`, `updated_at`) VALUES
(1, 2, 'request_booking', 4, 1, NULL, '2025-11-03 04:02:25', '2025-11-03 04:02:25'),
(5, 2, 'verified_by_head', 2, 1, 'Baiklah ini catatan', '2025-11-03 07:22:00', '2025-11-03 07:22:00'),
(8, 3, 'request_booking', 4, 1, NULL, '2025-11-03 07:47:21', '2025-11-03 07:47:21'),
(9, 3, 'verified_by_head', 2, 1, 'test', '2025-11-03 07:56:40', '2025-11-03 07:56:40'),
(10, 3, 'verified_by_laboran', 3, 1, 'test catatan', '2025-11-03 07:57:06', '2025-11-03 07:57:06'),
(11, 4, 'request_booking', 4, 1, NULL, '2025-11-04 02:38:33', '2025-11-04 02:38:33'),
(12, 4, 'verified_by_head', 2, 1, 'test', '2025-11-04 03:04:32', '2025-11-04 03:04:32'),
(13, 4, 'verified_by_laboran', 3, 1, 'catatan', '2025-11-04 07:07:05', '2025-11-04 07:07:05'),
(19, 4, 'returned_by_requestor', 3, 1, NULL, '2025-11-11 04:06:42', '2025-11-11 04:06:42'),
(20, 4, 'return_confirmed_by_laboran', 3, 1, 'Test', '2025-11-11 04:06:42', '2025-11-11 04:06:42'),
(22, 2, 'verified_by_laboran', 3, 0, 'sy tolak', '2025-11-11 07:07:17', '2025-11-11 07:07:17'),
(23, 7, 'request_booking', 4, 1, NULL, '2025-11-11 07:12:20', '2025-11-11 07:12:20'),
(24, 7, 'verified_by_head', 2, 1, 'Ini tugas untuk anda', '2025-11-11 07:16:16', '2025-11-11 07:16:16'),
(25, 7, 'verified_by_laboran', 3, 1, 'Boleh dibawa keluar', '2025-11-11 07:20:13', '2025-11-11 07:20:13'),
(28, 7, 'returned_by_requestor', 3, 1, NULL, '2025-11-11 07:23:24', '2025-11-11 07:23:24'),
(29, 7, 'return_confirmed_by_laboran', 3, 1, 'aman barangnya', '2025-11-11 07:23:24', '2025-11-11 07:23:24'),
(30, 8, 'request_booking', 4, 1, NULL, '2025-11-11 08:33:24', '2025-11-11 08:33:24'),
(31, 8, 'verified_by_head', 2, 1, 'Hai', '2025-11-11 08:46:54', '2025-11-11 08:46:54'),
(32, 8, 'verified_by_laboran', 3, 1, 'test', '2025-11-11 08:54:11', '2025-11-11 08:54:11'),
(33, 9, 'request_booking', 4, 1, NULL, '2025-11-17 03:17:10', '2025-11-17 03:17:10'),
(34, 9, 'verified_by_head', 2, 1, 'Test', '2025-11-17 05:24:40', '2025-11-17 05:24:40'),
(35, 9, 'verified_by_laboran', 3, 1, 'test', '2025-11-17 05:31:35', '2025-11-17 05:31:35'),
(38, 9, 'returned_by_requestor', 4, 1, 'tidak ada catatan', '2025-11-20 03:05:59', '2025-11-20 03:05:59'),
(39, 9, 'return_confirmed_by_laboran', 3, 1, 'baik sudah', '2025-11-20 03:14:58', '2025-11-20 03:14:58'),
(40, 8, 'returned_by_requestor', 3, 1, NULL, '2025-11-20 07:18:45', '2025-11-20 07:18:45'),
(41, 8, 'return_confirmed_by_laboran', 3, 1, 'test', '2025-11-20 07:18:45', '2025-11-20 07:18:45');

-- --------------------------------------------------------

--
-- Struktur dari tabel `booking_equipment`
--

CREATE TABLE `booking_equipment` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `booking_id` bigint(20) UNSIGNED NOT NULL,
  `laboratory_equipment_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `booking_equipment`
--

INSERT INTO `booking_equipment` (`id`, `booking_id`, `laboratory_equipment_id`, `quantity`, `created_at`, `updated_at`) VALUES
(2, 3, 6, 30, '2025-11-03 07:47:21', '2025-11-03 07:47:21'),
(3, 4, 2, 5, '2025-11-04 02:38:31', '2025-11-04 02:38:31'),
(4, 4, 4, 2, '2025-11-04 02:38:31', '2025-11-04 02:38:31'),
(5, 7, 2, 5, '2025-11-11 07:12:20', '2025-11-11 07:12:20'),
(6, 8, 5, 10, '2025-11-11 08:33:24', '2025-11-11 08:33:24'),
(7, 9, 2, 1, '2025-11-17 03:17:08', '2025-11-17 03:17:08');

-- --------------------------------------------------------

--
-- Struktur dari tabel `booking_materials`
--

CREATE TABLE `booking_materials` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `booking_id` bigint(20) UNSIGNED NOT NULL,
  `laboratory_material_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `booking_materials`
--

INSERT INTO `booking_materials` (`id`, `booking_id`, `laboratory_material_id`, `quantity`, `created_at`, `updated_at`) VALUES
(1, 3, 1, 2, '2025-11-03 07:47:21', '2025-11-03 07:47:21');

-- --------------------------------------------------------

--
-- Struktur dari tabel `faculties`
--

CREATE TABLE `faculties` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `faculties`
--

INSERT INTO `faculties` (`id`, `code`, `name`, `created_at`, `updated_at`) VALUES
(1, 'FSTI', 'Fakultas Sains dan Teknologi Informasi', NULL, NULL),
(2, 'FPB', 'Fakultas Pembangunan Berkelanjutan', NULL, NULL),
(3, 'FRTI', 'Fakultas Rekayasa dan Teknologi Industri', NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `institutions`
--

CREATE TABLE `institutions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `jobs`
--

INSERT INTO `jobs` (`id`, `queue`, `payload`, `attempts`, `reserved_at`, `available_at`, `created_at`) VALUES
(1, 'default', '{\"uuid\":\"a7e55590-e112-4d70-83f2-33ec70b1e2fb\",\"displayName\":\"App\\\\Mail\\\\BookingNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:28:\\\"App\\\\Mail\\\\BookingNotification\\\":3:{s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:19:\\\"kepalalab@gmail.com\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762142545, 1762142545),
(2, 'default', '{\"uuid\":\"cd937082-0767-4e3a-9dc6-c3da90ba6b29\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationSupervisor\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:38:\\\"App\\\\Mail\\\\BookingNotificationSupervisor\\\":4:{s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:2;s:9:\\\"relations\\\";a:2:{i:0;s:4:\\\"user\\\";i:1;s:17:\\\"user.studyProgram\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:26:\\\"10211067@student.itk.ac.id\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762142545, 1762142545),
(3, 'default', '{\"uuid\":\"3fea6e80-c9e5-42f2-8e76-a235bdced370\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationKepalaLabApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:45:\\\"App\\\\Mail\\\\BookingNotificationKepalaLabApproved\\\":5:{s:10:\\\"\\u0000*\\u0000laboran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:3;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:2;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:17:\\\"laboran@gmail.com\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762154092, 1762154092),
(4, 'default', '{\"uuid\":\"eee85f77-dfab-4e68-84ad-d9ed895f6d63\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationKepalaLabApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:45:\\\"App\\\\Mail\\\\BookingNotificationKepalaLabApproved\\\":5:{s:10:\\\"\\u0000*\\u0000laboran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:3;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:2;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:17:\\\"laboran@gmail.com\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762154277, 1762154277),
(5, 'default', '{\"uuid\":\"2a596dc8-310d-437b-bad7-fbb145757a2c\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationKepalaLabApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:45:\\\"App\\\\Mail\\\\BookingNotificationKepalaLabApproved\\\":5:{s:10:\\\"\\u0000*\\u0000laboran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:3;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:2;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:17:\\\"laboran@gmail.com\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762154319, 1762154319),
(6, 'default', '{\"uuid\":\"bdd65759-c1da-4401-a635-271c31527fe3\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationKepalaLabApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:45:\\\"App\\\\Mail\\\\BookingNotificationKepalaLabApproved\\\":5:{s:10:\\\"\\u0000*\\u0000laboran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:3;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:2;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:17:\\\"laboran@gmail.com\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762154520, 1762154520),
(7, 'default', '{\"uuid\":\"22739980-3dd9-4eb7-9bdc-4d06db05c84e\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationLaboranApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:43:\\\"App\\\\Mail\\\\BookingNotificationLaboranApproved\\\":4:{s:12:\\\"\\u0000*\\u0000requestor\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:4;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:2;s:9:\\\"relations\\\";a:1:{i:0;s:4:\\\"user\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:26:\\\"10211067@student.itk.ac.id\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762154555, 1762154555),
(8, 'default', '{\"uuid\":\"a515d356-66b4-46cc-b933-b9dc18399ea5\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationRejected\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:36:\\\"App\\\\Mail\\\\BookingNotificationRejected\\\":6:{s:12:\\\"\\u0000*\\u0000requestor\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:4;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:2;s:9:\\\"relations\\\";a:1:{i:0;s:4:\\\"user\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:14:\\\"\\u0000*\\u0000information\\\";s:10:\\\"Saya Tolak\\\";s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:26:\\\"10211067@student.itk.ac.id\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762154555, 1762154555),
(10, 'default', '{\"uuid\":\"ba126220-3820-45be-891d-300a4f855ddb\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationRejected\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:36:\\\"App\\\\Mail\\\\BookingNotificationRejected\\\":6:{s:12:\\\"\\u0000*\\u0000requestor\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:4;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:2;s:9:\\\"relations\\\";a:1:{i:0;s:4:\\\"user\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:14:\\\"\\u0000*\\u0000information\\\";s:10:\\\"saya tolak\\\";s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:26:\\\"10211067@student.itk.ac.id\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762154771, 1762154771),
(11, 'default', '{\"uuid\":\"960c485e-a860-42d2-9013-87bfad1b2479\",\"displayName\":\"App\\\\Mail\\\\BookingNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:28:\\\"App\\\\Mail\\\\BookingNotification\\\":3:{s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:19:\\\"kepalalab@gmail.com\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762156041, 1762156041),
(12, 'default', '{\"uuid\":\"e9a2eb88-7e98-4a14-beaa-5c0536490245\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationSupervisor\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:38:\\\"App\\\\Mail\\\\BookingNotificationSupervisor\\\":4:{s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:3;s:9:\\\"relations\\\";a:6:{i:0;s:10:\\\"equipments\\\";i:1;s:30:\\\"equipments.laboratoryEquipment\\\";i:2;s:9:\\\"materials\\\";i:3;s:28:\\\"materials.laboratoryMaterial\\\";i:4;s:4:\\\"user\\\";i:5;s:17:\\\"user.studyProgram\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:26:\\\"10211067@student.itk.ac.id\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762156041, 1762156041),
(13, 'default', '{\"uuid\":\"bcbcac8f-ab32-4996-9105-5a608c1ef66e\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationKepalaLabApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:45:\\\"App\\\\Mail\\\\BookingNotificationKepalaLabApproved\\\":5:{s:10:\\\"\\u0000*\\u0000laboran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:3;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:3;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:17:\\\"laboran@gmail.com\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762156600, 1762156600),
(14, 'default', '{\"uuid\":\"12a6961b-dd2c-4fc2-8ea2-c3c530a82577\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationLaboranApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:43:\\\"App\\\\Mail\\\\BookingNotificationLaboranApproved\\\":4:{s:12:\\\"\\u0000*\\u0000requestor\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:4;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:3;s:9:\\\"relations\\\";a:1:{i:0;s:4:\\\"user\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:26:\\\"10211067@student.itk.ac.id\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762156626, 1762156626),
(15, 'default', '{\"uuid\":\"9b2512a7-5dcb-4b52-b6b6-96e0cacdffb4\",\"displayName\":\"App\\\\Mail\\\\BookingNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:28:\\\"App\\\\Mail\\\\BookingNotification\\\":3:{s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:19:\\\"kepalalab@gmail.com\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762223913, 1762223913),
(16, 'default', '{\"uuid\":\"8ced8b57-f940-439e-951a-ddc3d6cd98a5\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationSupervisor\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:38:\\\"App\\\\Mail\\\\BookingNotificationSupervisor\\\":4:{s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:4;s:9:\\\"relations\\\";a:4:{i:0;s:10:\\\"equipments\\\";i:1;s:30:\\\"equipments.laboratoryEquipment\\\";i:2;s:4:\\\"user\\\";i:3;s:17:\\\"user.studyProgram\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:21:\\\"najibbijan0@gmail.com\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762223913, 1762223913),
(17, 'default', '{\"uuid\":\"b68dca81-0fcb-4c7e-80c2-c09fe699cb6a\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationKepalaLabApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:45:\\\"App\\\\Mail\\\\BookingNotificationKepalaLabApproved\\\":5:{s:10:\\\"\\u0000*\\u0000laboran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:3;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:4;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:17:\\\"laboran@gmail.com\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762225472, 1762225472),
(18, 'default', '{\"uuid\":\"82621ecd-1563-432a-a701-9980f3650929\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationLaboranApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:43:\\\"App\\\\Mail\\\\BookingNotificationLaboranApproved\\\":4:{s:12:\\\"\\u0000*\\u0000requestor\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:4;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:4;s:9:\\\"relations\\\";a:1:{i:0;s:4:\\\"user\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:26:\\\"10211067@student.itk.ac.id\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762240025, 1762240025),
(19, 'default', '{\"uuid\":\"af2aa108-f3a0-494c-a948-62047d6094e9\",\"displayName\":\"App\\\\Mail\\\\BookingNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:28:\\\"App\\\\Mail\\\\BookingNotification\\\":3:{s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:19:\\\"kepalalab@gmail.com\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762244349, 1762244349),
(20, 'default', '{\"uuid\":\"c4babfa5-b670-4c93-8909-d802b9317592\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationSupervisor\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:38:\\\"App\\\\Mail\\\\BookingNotificationSupervisor\\\":4:{s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:5;s:9:\\\"relations\\\";a:2:{i:0;s:4:\\\"user\\\";i:1;s:17:\\\"user.studyProgram\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:26:\\\"10211067@student.itk.ac.id\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762244349, 1762244349),
(21, 'default', '{\"uuid\":\"3c162751-30ec-453e-807b-7873eea76691\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationKepalaLabApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:45:\\\"App\\\\Mail\\\\BookingNotificationKepalaLabApproved\\\":5:{s:10:\\\"\\u0000*\\u0000laboran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:3;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:5;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:17:\\\"laboran@gmail.com\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762244368, 1762244368),
(22, 'default', '{\"uuid\":\"30cc8a3a-702d-45cd-944f-e6a2f970f3f5\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationLaboranApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:43:\\\"App\\\\Mail\\\\BookingNotificationLaboranApproved\\\":4:{s:12:\\\"\\u0000*\\u0000requestor\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:4;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:5;s:9:\\\"relations\\\";a:1:{i:0;s:4:\\\"user\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:26:\\\"10211067@student.itk.ac.id\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762786805, 1762786805),
(23, 'default', '{\"uuid\":\"40166b81-cdd5-4e85-ba4a-e33d95b7b43b\",\"displayName\":\"App\\\\Mail\\\\BookingNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:28:\\\"App\\\\Mail\\\\BookingNotification\\\":3:{s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:19:\\\"kepalalab@gmail.com\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762829127, 1762829127),
(24, 'default', '{\"uuid\":\"a705f663-6a2e-4f6f-ae49-dea7489d198a\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationSupervisor\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:38:\\\"App\\\\Mail\\\\BookingNotificationSupervisor\\\":4:{s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:6;s:9:\\\"relations\\\";a:2:{i:0;s:4:\\\"user\\\";i:1;s:17:\\\"user.studyProgram\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:21:\\\"najibbijan0@gmail.com\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762829127, 1762829127),
(25, 'default', '{\"uuid\":\"d475cb95-0436-4312-8135-b3be25734df0\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationKepalaLabApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:45:\\\"App\\\\Mail\\\\BookingNotificationKepalaLabApproved\\\":5:{s:10:\\\"\\u0000*\\u0000laboran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:3;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:6;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:17:\\\"laboran@gmail.com\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762829144, 1762829144),
(26, 'default', '{\"uuid\":\"8965815c-f1c1-4bcc-a315-280730e4b34a\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationLaboranApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:43:\\\"App\\\\Mail\\\\BookingNotificationLaboranApproved\\\":4:{s:12:\\\"\\u0000*\\u0000requestor\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:4;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:2;s:9:\\\"relations\\\";a:1:{i:0;s:4:\\\"user\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:26:\\\"10211067@student.itk.ac.id\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762844801, 1762844801),
(27, 'default', '{\"uuid\":\"cc0c2ee1-ade9-43a3-978d-fef9dc84f8e1\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationRejected\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:36:\\\"App\\\\Mail\\\\BookingNotificationRejected\\\":6:{s:12:\\\"\\u0000*\\u0000requestor\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:4;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:2;s:9:\\\"relations\\\";a:1:{i:0;s:4:\\\"user\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:14:\\\"\\u0000*\\u0000information\\\";s:8:\\\"sy tolak\\\";s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:26:\\\"10211067@student.itk.ac.id\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762844837, 1762844837),
(28, 'default', '{\"uuid\":\"c0a521f6-ecf3-4cdd-be79-3a7f27e627d2\",\"displayName\":\"App\\\\Mail\\\\BookingNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:28:\\\"App\\\\Mail\\\\BookingNotification\\\":3:{s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:19:\\\"kepalalab@gmail.com\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762845140, 1762845140),
(29, 'default', '{\"uuid\":\"54f0f676-ca95-4a19-a9aa-1b68d9e9422d\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationSupervisor\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:38:\\\"App\\\\Mail\\\\BookingNotificationSupervisor\\\":4:{s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:7;s:9:\\\"relations\\\";a:4:{i:0;s:10:\\\"equipments\\\";i:1;s:30:\\\"equipments.laboratoryEquipment\\\";i:2;s:4:\\\"user\\\";i:3;s:17:\\\"user.studyProgram\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:21:\\\"najibbijan0@gmail.com\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762845140, 1762845140),
(30, 'default', '{\"uuid\":\"dfcdd4ab-e5ef-4a70-bb71-fb1fc20a0ac7\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationKepalaLabApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:45:\\\"App\\\\Mail\\\\BookingNotificationKepalaLabApproved\\\":5:{s:10:\\\"\\u0000*\\u0000laboran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:3;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:7;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:17:\\\"laboran@gmail.com\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762845376, 1762845376),
(31, 'default', '{\"uuid\":\"04293ddf-be0a-42d4-9012-cc698497cb64\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationLaboranApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:43:\\\"App\\\\Mail\\\\BookingNotificationLaboranApproved\\\":4:{s:12:\\\"\\u0000*\\u0000requestor\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:4;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:7;s:9:\\\"relations\\\";a:1:{i:0;s:4:\\\"user\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:26:\\\"10211067@student.itk.ac.id\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762845613, 1762845613),
(32, 'default', '{\"uuid\":\"e9392256-0812-46a5-bc07-5489986603d3\",\"displayName\":\"App\\\\Mail\\\\BookingNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:28:\\\"App\\\\Mail\\\\BookingNotification\\\":3:{s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:19:\\\"kepalalab@gmail.com\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762850004, 1762850004),
(33, 'default', '{\"uuid\":\"fcbabd49-6fc7-4858-929e-ce45efe74fad\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationSupervisor\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:38:\\\"App\\\\Mail\\\\BookingNotificationSupervisor\\\":4:{s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:8;s:9:\\\"relations\\\";a:4:{i:0;s:10:\\\"equipments\\\";i:1;s:30:\\\"equipments.laboratoryEquipment\\\";i:2;s:4:\\\"user\\\";i:3;s:17:\\\"user.studyProgram\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:21:\\\"najibbijan0@gmail.com\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762850004, 1762850004);
INSERT INTO `jobs` (`id`, `queue`, `payload`, `attempts`, `reserved_at`, `available_at`, `created_at`) VALUES
(34, 'default', '{\"uuid\":\"0f846cc6-d191-486f-b56b-ba48ad27aa8e\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationKepalaLabApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:45:\\\"App\\\\Mail\\\\BookingNotificationKepalaLabApproved\\\":5:{s:10:\\\"\\u0000*\\u0000laboran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:3;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:8;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:17:\\\"laboran@gmail.com\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762850814, 1762850814),
(35, 'default', '{\"uuid\":\"95d21f60-867e-4417-841f-753e6379bac3\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationLaboranApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:43:\\\"App\\\\Mail\\\\BookingNotificationLaboranApproved\\\":4:{s:12:\\\"\\u0000*\\u0000requestor\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:4;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:8;s:9:\\\"relations\\\";a:1:{i:0;s:4:\\\"user\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:26:\\\"10211067@student.itk.ac.id\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1762851251, 1762851251),
(36, 'default', '{\"uuid\":\"df63c03d-8b83-42b2-8840-87cda5ef1a41\",\"displayName\":\"App\\\\Mail\\\\BookingNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:28:\\\"App\\\\Mail\\\\BookingNotification\\\":3:{s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:19:\\\"kepalalab@gmail.com\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1763349430, 1763349430),
(37, 'default', '{\"uuid\":\"1d00ad5e-ef13-4697-8d06-e1f6026888d4\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationSupervisor\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:38:\\\"App\\\\Mail\\\\BookingNotificationSupervisor\\\":4:{s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:9;s:9:\\\"relations\\\";a:4:{i:0;s:10:\\\"equipments\\\";i:1;s:30:\\\"equipments.laboratoryEquipment\\\";i:2;s:4:\\\"user\\\";i:3;s:17:\\\"user.studyProgram\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:26:\\\"10211067@student.itk.ac.id\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1763349430, 1763349430),
(38, 'default', '{\"uuid\":\"ca0f5003-d206-471a-bf8d-3154406ab51c\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationKepalaLabApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:45:\\\"App\\\\Mail\\\\BookingNotificationKepalaLabApproved\\\":5:{s:10:\\\"\\u0000*\\u0000laboran\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:3;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:9;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:17:\\\"laboran@gmail.com\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";s:11:\\\"afterCommit\\\";b:1;}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";b:1;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1763357080, 1763357080),
(39, 'default', '{\"uuid\":\"6b7f04ed-3ac5-487d-b41c-fdebffb321a3\",\"displayName\":\"App\\\\Mail\\\\BookingNotificationLaboranApproved\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Mail\\\\SendQueuedMailable\",\"command\":\"O:34:\\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\\":15:{s:8:\\\"mailable\\\";O:43:\\\"App\\\\Mail\\\\BookingNotificationLaboranApproved\\\":4:{s:12:\\\"\\u0000*\\u0000requestor\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\User\\\";s:2:\\\"id\\\";i:4;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:10:\\\"\\u0000*\\u0000booking\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Booking\\\";s:2:\\\"id\\\";i:9;s:9:\\\"relations\\\";a:1:{i:0;s:4:\\\"user\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:2:\\\"to\\\";a:1:{i:0;a:2:{s:4:\\\"name\\\";N;s:7:\\\"address\\\";s:26:\\\"10211067@student.itk.ac.id\\\";}}s:6:\\\"mailer\\\";s:4:\\\"smtp\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:13:\\\"maxExceptions\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:3:\\\"job\\\";N;}\"}}', 0, NULL, 1763357495, 1763357495);

-- --------------------------------------------------------

--
-- Struktur dari tabel `laboratory_equipments`
--

CREATE TABLE `laboratory_equipments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `laboratory_room_id` bigint(20) UNSIGNED NOT NULL,
  `equipment_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit` varchar(255) NOT NULL,
  `function` text DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `brand` varchar(255) NOT NULL,
  `equipment_type` varchar(255) NOT NULL,
  `origin` varchar(255) NOT NULL,
  `condition` varchar(255) NOT NULL,
  `condition_description` text DEFAULT NULL,
  `asset_code` varchar(255) NOT NULL,
  `student_price` int(11) NOT NULL DEFAULT 0,
  `lecturer_price` int(11) NOT NULL DEFAULT 0,
  `external_price` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `laboratory_equipments`
--

INSERT INTO `laboratory_equipments` (`id`, `laboratory_room_id`, `equipment_name`, `quantity`, `unit`, `function`, `photo`, `brand`, `equipment_type`, `origin`, `condition`, `condition_description`, `asset_code`, `student_price`, `lecturer_price`, `external_price`, `created_at`, `updated_at`) VALUES
(1, 1, 'Mikroskop Binokuler', 10, 'unit', 'Mengamati objek mikroskopis', NULL, 'Olympus', 'Barang BMN', 'Jepang', 'Baik', 'Tidak ada kerusakan', 'LAB-EQ-001', 0, 15000, 20000, NULL, NULL),
(2, 1, 'Centrifuge', 5, 'unit', 'Memisahkan partikel dalam cairan', NULL, 'Eppendorf', 'Barang BHPL', 'Jerman', 'Baik', 'Baru diservis', 'LAB-EQ-002', 0, 17000, 22000, NULL, NULL),
(3, 2, 'Hot Plate', 8, 'unit', 'Memanaskan larutan', NULL, 'Thermo', 'Barang BHPL', 'Amerika', 'Cukup', 'Permukaan sedikit tergores', 'LAB-EQ-003', 0, 14000, 18000, NULL, NULL),
(4, 2, 'pH Meter', 4, 'unit', 'Mengukur tingkat keasaman', NULL, 'Hanna', 'Barang BHPL', 'Italia', 'Baik', 'Kalibrasi rutin', 'LAB-EQ-004', 0, 12000, 16000, NULL, NULL),
(5, 1, 'Glassware Set', 30, 'pcs', 'Peralatan gelas umum', NULL, 'Pyrex', 'Barang Hibah', 'Amerika', 'Baik', 'Bersih dan siap pakai', 'LAB-EQ-005', 0, 3000, 5000, NULL, NULL),
(6, 2, 'Spectrophotometer', 2, 'unit', 'Mengukur absorbansi sampel', NULL, 'Shimadzu', 'Barang BMN', 'Jepang', 'Baik', 'Terawat', 'LAB-EQ-006', 0, 30000, 40000, NULL, NULL),
(7, 1, 'Incubator', 3, 'unit', 'Menginkubasi sampel', NULL, 'Memmert', 'Barang BMN', 'Jerman', 'Cukup', 'Perlu pemeriksaan suhu', 'LAB-EQ-007', 0, 22000, 30000, NULL, NULL),
(8, 2, 'pippet Set', 20, 'pcs', 'Mengukur volume cairan', NULL, 'Gilson', 'Barang Hibah', 'Prancis', 'Baik', 'Baru diganti beberapa batang', 'LAB-EQ-008', 0, 2000, 3000, NULL, NULL),
(9, 1, 'Autoclave', 1, 'unit', 'Sterilisasi peralatan', NULL, 'Tuttnauer', 'Barang BMN', 'Israel', 'Baik', 'Berfungsi normal', 'LAB-EQ-009', 0, 60000, 80000, NULL, NULL),
(10, 2, 'Water Bath', 4, 'unit', 'Menjaga suhu larutan', NULL, 'Julabo', 'Barang BHPL', 'Jerman', 'Baik', 'Perawatan rutin dilakukan', 'LAB-EQ-010', 0, 10000, 14000, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `laboratory_materials`
--

CREATE TABLE `laboratory_materials` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(255) NOT NULL,
  `laboratory_room_id` bigint(20) UNSIGNED NOT NULL,
  `material_name` varchar(255) NOT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `stock` int(11) NOT NULL,
  `unit` varchar(255) NOT NULL,
  `purchase_date` date NOT NULL,
  `expiry_date` date DEFAULT NULL,
  `description` text DEFAULT NULL,
  `refill_date` date NOT NULL,
  `student_price` int(11) NOT NULL DEFAULT 0,
  `lecturer_price` int(11) NOT NULL DEFAULT 0,
  `external_price` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `laboratory_materials`
--

INSERT INTO `laboratory_materials` (`id`, `code`, `laboratory_room_id`, `material_name`, `brand`, `stock`, `unit`, `purchase_date`, `expiry_date`, `description`, `refill_date`, `student_price`, `lecturer_price`, `external_price`, `created_at`, `updated_at`) VALUES
(1, 'MAT-001', 1, 'Natrium Klorida', 'Merck', 20, 'gram', '2025-01-10', '2026-01-10', 'Garam dapur untuk praktikum kimia dasar', '2025-09-01', 0, 7000, 10000, NULL, NULL),
(2, 'MAT-002', 1, 'Aquadest', 'Bratachem', 50, 'liter', '2025-02-15', NULL, 'Air murni untuk pelarut', '2025-09-10', 0, 5000, 8000, NULL, NULL),
(3, 'MAT-003', 2, 'Ethanol 96%', 'Sigma', 10, 'liter', '2025-03-20', '2026-03-20', 'Pelarut organik untuk praktikum', '2025-09-15', 0, 10000, 15000, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `laboratory_rooms`
--

CREATE TABLE `laboratory_rooms` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `floor` varchar(255) NOT NULL,
  `student_price` int(11) NOT NULL DEFAULT 0,
  `lecturer_price` int(11) NOT NULL DEFAULT 0,
  `external_price` int(11) NOT NULL DEFAULT 0,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `laboratory_rooms`
--

INSERT INTO `laboratory_rooms` (`id`, `name`, `floor`, `student_price`, `lecturer_price`, `external_price`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 'Lab A', 'Lantai 1', 50000, 75000, 100000, 3, NULL, NULL),
(2, 'Lab B', 'Lantai 2', 60000, 80000, 110000, 3, NULL, NULL),
(3, 'Lab C', 'Lantai 3', 55000, 78000, 105000, 3, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `laboratory_temporary_equipment`
--

CREATE TABLE `laboratory_temporary_equipment` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `laboratory_temporary_equipment`
--

INSERT INTO `laboratory_temporary_equipment` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Gelas', '2025-11-21 02:51:19', '2025-11-21 02:51:19');

-- --------------------------------------------------------

--
-- Struktur dari tabel `majors`
--

CREATE TABLE `majors` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `faculty_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `majors`
--

INSERT INTO `majors` (`id`, `code`, `name`, `faculty_id`, `created_at`, `updated_at`) VALUES
(1, NULL, 'Jurusan Sains dan Analitika Data', 1, NULL, NULL),
(2, NULL, 'Jurusan Teknik Elektro, Informatika, dan Bisnis', 1, NULL, NULL),
(3, NULL, 'Jurusan Teknologi Kemaritiman', 2, NULL, NULL),
(4, NULL, 'Jurusan Teknik Sipil dan Perencanaan', 2, NULL, NULL),
(5, NULL, 'Jurusan Teknologi Industri', 3, NULL, NULL),
(6, NULL, 'Jurusan Rekayasa Industri', 3, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(88, '2013_01_01_030137_create_faculties_table', 1),
(89, '2013_01_02_115757_create_majors_table', 1),
(90, '2013_01_02_115801_create_study_programs_table', 1),
(91, '2013_09_30_063856_create_institutions_table', 1),
(92, '2014_10_12_000000_create_users_table', 1),
(93, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(94, '2019_08_19_000000_create_failed_jobs_table', 1),
(95, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(96, '2025_01_12_200108_create_academic_years_table', 1),
(97, '2025_01_12_203330_create_testing_types_table', 1),
(98, '2025_01_13_004734_create_practicums_table', 1),
(99, '2025_04_14_024309_create_laboratory_rooms_table', 1),
(100, '2025_04_21_200513_create_laboratory_equipments_table', 1),
(101, '2025_04_21_201659_create_laboratory_materials_table', 1),
(102, '2025_07_15_232354_create_bookings_table', 1),
(103, '2025_07_15_234019_create_booking_equipment_table', 1),
(104, '2025_07_15_234249_create_booking_materials_table', 1),
(105, '2025_07_15_234501_create_booking_approvals_table', 1),
(106, '2025_08_17_215303_create_practicum_schedulings_table', 1),
(107, '2025_08_17_215603_create_practicum_classes_table', 1),
(108, '2025_08_17_221601_create_practicum_approvals_table', 1),
(109, '2025_08_17_221938_create_practicum_scheduling_equipment_table', 1),
(110, '2025_08_17_221946_create_practicum_scheduling_materials_table', 1),
(111, '2025_08_26_014930_create_jobs_table', 1),
(112, '2025_09_23_122727_create_practicum_modules_table', 1),
(113, '2025_10_02_104035_create_practicum_sessions_table', 1),
(114, '2025_10_09_094607_create_laboratory_temporary_equipment_table', 1),
(115, '2025_10_28_164748_create_payments_table', 1),
(116, '2025_10_28_165441_create_payment_items_table', 1);

-- --------------------------------------------------------

--
-- Struktur dari tabel `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `payable_id` bigint(20) UNSIGNED NOT NULL,
  `payable_type` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `amount` int(11) NOT NULL,
  `invoice_file` varchar(255) DEFAULT NULL,
  `receipt_file` varchar(255) DEFAULT NULL,
  `va_number` varchar(255) NOT NULL,
  `status` enum('rejected','approved','pending') NOT NULL DEFAULT 'pending',
  `verified_by` bigint(20) UNSIGNED NOT NULL,
  `verified_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `payment_items`
--

CREATE TABLE `payment_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `payment_id` bigint(20) UNSIGNED NOT NULL,
  `payable_id` bigint(20) UNSIGNED NOT NULL,
  `payable_type` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `quantity` double NOT NULL,
  `total` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(8, 'App\\Models\\User', 3, 'api_token', '7e6cc0da4582468c52897376614132b80ae2e9da39d9322786fe333af54dd4a4', '[\"*\"]', '2025-11-03 08:19:15', NULL, '2025-11-03 07:56:51', '2025-11-03 08:19:15'),
(10, 'App\\Models\\User', 3, 'api_token', '2a295a44e7403167ae0c0f058a8f0b5e9695e900fc3341875762259b2d8cac5c', '[\"*\"]', '2025-11-04 08:30:19', NULL, '2025-11-04 03:06:05', '2025-11-04 08:30:19'),
(11, 'App\\Models\\User', 2, 'api_token', '4bc359930fb73cea7c393f412c48666674c3cdc41b706ad786a6cc7c5779349b', '[\"*\"]', '2025-11-11 08:54:21', NULL, '2025-11-04 08:17:44', '2025-11-11 08:54:21'),
(12, 'App\\Models\\User', 3, 'api_token', 'a5365d313fd2ebc1fdab28eb2769e0679fe10fbb2230f04faedb95b2160bd62e', '[\"*\"]', '2025-11-09 13:37:13', NULL, '2025-11-07 08:39:43', '2025-11-09 13:37:13'),
(13, 'App\\Models\\User', 2, 'api_token', '6f582a7b7617a441a5d078eee043434f6af8c35102a5627910224cd6850784b8', '[\"*\"]', '2025-11-09 13:49:20', NULL, '2025-11-09 13:36:42', '2025-11-09 13:49:20'),
(15, 'App\\Models\\User', 3, 'api_token', 'd4927a7a45af78a0226aded723d53487ad124f79e9c2b164a4784a9ba35ee2f0', '[\"*\"]', '2025-11-10 15:00:16', NULL, '2025-11-10 14:47:23', '2025-11-10 15:00:16'),
(16, 'App\\Models\\User', 3, 'api_token', '690565ef80c9dc6ae0ce99b19d43f785c288b80d3f0372621a12540aba42d97f', '[\"*\"]', '2025-11-11 08:54:12', NULL, '2025-11-11 02:42:36', '2025-11-11 08:54:12'),
(18, 'App\\Models\\User', 3, 'api_token', '9ad26dfa1842fe9eb51dad43511fd232d61484908853e26b92a7d3adc2c064fa', '[\"*\"]', '2025-11-17 05:32:37', NULL, '2025-11-17 05:26:14', '2025-11-17 05:32:37'),
(19, 'App\\Models\\User', 3, 'api_token', 'f79c71002ac2782e33bc9ac537ab6789f7dd4db9e3e569899a5d09ec9af9c9a2', '[\"*\"]', '2025-11-20 03:15:01', NULL, '2025-11-20 03:13:16', '2025-11-20 03:15:01'),
(20, 'App\\Models\\User', 3, 'api_token', 'bac66c2d4bf6b5e41da55980cbca00779ab66e209cb7825e16868ef9080f832a', '[\"*\"]', '2025-11-20 08:51:16', NULL, '2025-11-20 07:18:29', '2025-11-20 08:51:16'),
(26, 'App\\Models\\User', 3, 'api_token', 'da9b3a4e13637e7c8564e4f08a027d3a458bd23bab2219a822d96d6c2819c6d0', '[\"*\"]', '2025-11-21 02:53:57', NULL, '2025-11-21 02:53:19', '2025-11-21 02:53:57');

-- --------------------------------------------------------

--
-- Struktur dari tabel `practicums`
--

CREATE TABLE `practicums` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `study_program_id` bigint(20) UNSIGNED NOT NULL,
  `type` enum('compulsory','pbl','pjbl') NOT NULL,
  `sks` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `practicums`
--

INSERT INTO `practicums` (`id`, `code`, `name`, `study_program_id`, `type`, `sks`, `created_at`, `updated_at`) VALUES
(1, 'IS23123', 'Pemrogramman Web', 10, 'compulsory', 3, NULL, NULL),
(2, 'IS31231', 'Pemrogramman Beroriantasi Objek', 10, 'compulsory', 3, NULL, NULL),
(3, 'IS33123', 'Cloud Computing', 10, 'compulsory', 2, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `practicum_approvals`
--

CREATE TABLE `practicum_approvals` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `practicum_scheduling_id` bigint(20) UNSIGNED NOT NULL,
  `role` enum('pemohon','kepala_lab_terpadu','laboran') NOT NULL,
  `approver_id` bigint(20) UNSIGNED NOT NULL,
  `is_approved` tinyint(1) NOT NULL,
  `information` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `practicum_approvals`
--

INSERT INTO `practicum_approvals` (`id`, `practicum_scheduling_id`, `role`, `approver_id`, `is_approved`, `information`, `created_at`, `updated_at`) VALUES
(1, 1, 'pemohon', 6, 1, NULL, '2025-11-21 02:50:55', '2025-11-21 02:50:55'),
(2, 1, 'kepala_lab_terpadu', 2, 1, 'test catatan', '2025-11-21 02:52:06', '2025-11-21 02:52:06'),
(3, 1, 'laboran', 3, 1, 'Test', '2025-11-21 02:53:45', '2025-11-21 02:53:45');

-- --------------------------------------------------------

--
-- Struktur dari tabel `practicum_classes`
--

CREATE TABLE `practicum_classes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `practicum_scheduling_id` bigint(20) UNSIGNED NOT NULL,
  `lecturer_id` bigint(20) UNSIGNED NOT NULL,
  `laboratory_room_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `practicum_assistant` varchar(255) NOT NULL,
  `total_participant` int(11) NOT NULL,
  `total_group` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `practicum_classes`
--

INSERT INTO `practicum_classes` (`id`, `practicum_scheduling_id`, `lecturer_id`, `laboratory_room_id`, `name`, `practicum_assistant`, `total_participant`, `total_group`, `created_at`, `updated_at`) VALUES
(1, 1, 5, 1, 'Kelas A', 'Asistent A', 30, 5, '2025-11-21 02:50:54', '2025-11-21 02:50:54'),
(2, 1, 5, 1, 'Kelas B', 'Asistent A', 30, 5, '2025-11-21 02:50:54', '2025-11-21 02:50:54');

-- --------------------------------------------------------

--
-- Struktur dari tabel `practicum_modules`
--

CREATE TABLE `practicum_modules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `practicum_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` enum('Active','Deactive') NOT NULL DEFAULT 'Deactive',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `practicum_modules`
--

INSERT INTO `practicum_modules` (`id`, `practicum_id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'Pengantar pemrogramman web', 'Active', NULL, NULL),
(2, 1, 'HTML & CSS', 'Active', NULL, NULL),
(3, 2, 'Pengantar pemrogramman berorientasi objek', 'Active', NULL, NULL),
(4, 2, 'Class & Attribute', 'Active', NULL, NULL),
(5, 3, 'Pengantar cloud computing', 'Active', NULL, NULL),
(6, 3, 'PAAS & SAAS', 'Active', NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `practicum_schedulings`
--

CREATE TABLE `practicum_schedulings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `academic_year_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `laboran_id` bigint(20) UNSIGNED DEFAULT NULL,
  `practicum_id` bigint(20) UNSIGNED NOT NULL,
  `phone_number` char(14) NOT NULL,
  `status` enum('draft','pending','rejected','approved','revision') NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `practicum_schedulings`
--

INSERT INTO `practicum_schedulings` (`id`, `academic_year_id`, `user_id`, `laboran_id`, `practicum_id`, `phone_number`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 6, 3, 1, '081213039516', 'approved', '2025-11-21 02:50:54', '2025-11-21 02:53:45');

-- --------------------------------------------------------

--
-- Struktur dari tabel `practicum_scheduling_equipment`
--

CREATE TABLE `practicum_scheduling_equipment` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `practicum_scheduling_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `equipmentable_id` bigint(20) UNSIGNED NOT NULL,
  `equipmentable_type` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `practicum_scheduling_equipment`
--

INSERT INTO `practicum_scheduling_equipment` (`id`, `practicum_scheduling_id`, `quantity`, `equipmentable_id`, `equipmentable_type`, `created_at`, `updated_at`) VALUES
(1, 1, 20, 2, 'App\\Models\\LaboratoryEquipment', '2025-11-21 02:51:18', '2025-11-21 02:51:18'),
(2, 1, 3, 1, 'App\\Models\\LaboratoryTemporaryEquipment', '2025-11-21 02:51:19', '2025-11-21 02:51:19');

-- --------------------------------------------------------

--
-- Struktur dari tabel `practicum_scheduling_materials`
--

CREATE TABLE `practicum_scheduling_materials` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `practicum_scheduling_id` bigint(20) UNSIGNED NOT NULL,
  `laboratory_material_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `realization` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `practicum_scheduling_materials`
--

INSERT INTO `practicum_scheduling_materials` (`id`, `practicum_scheduling_id`, `laboratory_material_id`, `quantity`, `realization`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 50, 10, '2025-11-21 02:51:19', '2025-11-21 02:53:45');

-- --------------------------------------------------------

--
-- Struktur dari tabel `practicum_sessions`
--

CREATE TABLE `practicum_sessions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `practicum_class_id` bigint(20) UNSIGNED NOT NULL,
  `practicum_module_id` bigint(20) UNSIGNED NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `is_class_conducted` tinyint(1) DEFAULT NULL,
  `laboran_comment` varchar(255) DEFAULT NULL,
  `laboran_commented_at` datetime DEFAULT NULL,
  `lecturer_comment` varchar(255) DEFAULT NULL,
  `lecturer_commented_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `practicum_sessions`
--

INSERT INTO `practicum_sessions` (`id`, `practicum_class_id`, `practicum_module_id`, `start_time`, `end_time`, `is_class_conducted`, `laboran_comment`, `laboran_commented_at`, `lecturer_comment`, `lecturer_commented_at`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2025-11-21 08:00:00', '2025-11-21 17:00:00', NULL, NULL, NULL, NULL, NULL, '2025-11-21 02:50:54', '2025-11-21 02:50:54'),
(2, 1, 2, '2025-11-21 08:00:00', '2025-11-21 17:00:00', NULL, NULL, NULL, NULL, NULL, '2025-11-21 02:50:54', '2025-11-21 02:50:54'),
(3, 2, 1, '2025-11-28 08:00:00', '2025-11-28 17:00:00', NULL, NULL, NULL, NULL, NULL, '2025-11-21 02:50:54', '2025-11-21 02:50:54'),
(4, 2, 2, '2025-12-05 08:00:00', '2025-12-05 17:00:00', NULL, NULL, NULL, NULL, NULL, '2025-11-21 02:50:54', '2025-11-21 02:50:54');

-- --------------------------------------------------------

--
-- Struktur dari tabel `study_programs`
--

CREATE TABLE `study_programs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `major_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `study_programs`
--

INSERT INTO `study_programs` (`id`, `code`, `major_id`, `name`, `created_at`, `updated_at`) VALUES
(1, '01', 1, 'Fisika', NULL, NULL),
(2, '02', 1, 'Matematika', NULL, NULL),
(3, '03', 5, 'Teknik Mesin', NULL, NULL),
(4, '04', 2, 'Teknik Elektro', NULL, NULL),
(5, '05', 6, 'Teknik Kimia', NULL, NULL),
(6, '06', 5, 'Teknik Material dan Metalurgi', NULL, NULL),
(7, '07', 4, 'Teknik Sipil', NULL, NULL),
(8, '08', 4, 'Perencanaan Wilayah Kota', NULL, NULL),
(9, '09', 3, 'Teknik Perkapalan', NULL, NULL),
(10, '10', 2, 'Sistem Informasi', NULL, NULL),
(11, '11', 2, 'Informatika', NULL, NULL),
(12, '12', 5, 'Teknik Industri', NULL, NULL),
(13, '13', 3, 'Teknik Lingkungan', NULL, NULL),
(14, '14', 3, 'Teknik Kelautan', NULL, NULL),
(15, '15', 4, 'Arsitektur', NULL, NULL),
(16, '16', 6, 'Teknologi Pangan', NULL, NULL),
(17, '17', 1, 'Statistika', NULL, NULL),
(18, '18', 1, 'Ilmu Aktuaria', NULL, NULL),
(19, '19', 2, 'Bisnis Digital', NULL, NULL),
(20, '20', 6, 'Rekayasa Keselamatan', NULL, NULL),
(21, '21', 4, 'Desain Komunikasi Visual', NULL, NULL),
(22, '22', 5, 'Teknik Logistik', NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `testing_types`
--

CREATE TABLE `testing_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `unit` varchar(255) NOT NULL,
  `student_price` int(11) NOT NULL DEFAULT 0,
  `lecturer_price` int(11) NOT NULL DEFAULT 0,
  `external_price` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `role` enum('admin','admin_keuangan','kepala_lab_terpadu','dosen','koorprodi','kepala_lab_jurusan','laboran','mahasiswa','pihak_luar') NOT NULL,
  `study_program_id` bigint(20) UNSIGNED DEFAULT NULL,
  `institution_id` bigint(20) UNSIGNED DEFAULT NULL,
  `identity_num` varchar(255) DEFAULT NULL,
  `is_active` enum('Active','Deactive') NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `role`, `study_program_id`, `institution_id`, `identity_num`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Admin (Erlina)', 'labterpadu@itk.ac.id', NULL, '$2y$12$ySVHI2PZXSmvAjsJNtHt3esRdNNHdvGul/0DOHRTNP/En/97IJGsi', NULL, 'admin', NULL, NULL, NULL, 'Active', NULL, NULL),
(2, 'Kepalalab', 'kepalalab@gmail.com', NULL, '$2y$12$Gq9RxqNX2wuZxkSj9lhPfeWKHggu2w1cduZLCtlmZ60MP/BkKqNF6', NULL, 'kepala_lab_terpadu', 10, NULL, '2313321', 'Active', NULL, NULL),
(3, 'laboran', 'laboran@gmail.com', NULL, '$2y$12$8AXYdl/tgbu./2EwoGocUOWMiMLVpAOpbz1q/tuNF9cCDRgukxpVK', NULL, 'laboran', NULL, NULL, NULL, 'Active', NULL, NULL),
(4, 'Najibullah Muhariri', '10211067@student.itk.ac.id', NULL, '$2y$12$oIWzgj82ZqPdy.7/4uEfsek1ZPCa6SSjoiQN9uVDG9tACVLP8RuVG', NULL, 'mahasiswa', 10, NULL, '10211067', 'Active', '2025-11-03 03:59:20', '2025-11-03 03:59:20'),
(5, 'dosen A', 'dosen@gmail.com', NULL, '$2y$12$kepSjnACaQEjo0/NGH62Q.oyW8.F0BWNwHEtleBg31xvDcg0DSun2', NULL, 'dosen', 10, NULL, '3213123', 'Active', '2025-11-21 02:48:33', '2025-11-21 02:48:33'),
(6, 'kepalalabjurusan', 'kepalalabjurusan@gmail.com', NULL, '$2y$12$O8evGpoG8W4b6.s70l4dPuKqcXsAQ4JAHWd6aGjXolAH6AgRkib3W', NULL, 'kepala_lab_jurusan', 10, NULL, '32131231', 'Active', '2025-11-21 02:49:01', '2025-11-21 02:49:01');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `academic_years`
--
ALTER TABLE `academic_years`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bookings_academic_year_id_foreign` (`academic_year_id`),
  ADD KEY `bookings_user_id_foreign` (`user_id`),
  ADD KEY `bookings_laboran_id_foreign` (`laboran_id`),
  ADD KEY `bookings_laboratory_room_id_foreign` (`laboratory_room_id`);

--
-- Indeks untuk tabel `booking_approvals`
--
ALTER TABLE `booking_approvals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_approvals_booking_id_foreign` (`booking_id`),
  ADD KEY `booking_approvals_approver_id_foreign` (`approver_id`);

--
-- Indeks untuk tabel `booking_equipment`
--
ALTER TABLE `booking_equipment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_equipment_booking_id_foreign` (`booking_id`),
  ADD KEY `booking_equipment_laboratory_equipment_id_foreign` (`laboratory_equipment_id`);

--
-- Indeks untuk tabel `booking_materials`
--
ALTER TABLE `booking_materials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_materials_booking_id_foreign` (`booking_id`),
  ADD KEY `booking_materials_laboratory_material_id_foreign` (`laboratory_material_id`);

--
-- Indeks untuk tabel `faculties`
--
ALTER TABLE `faculties`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indeks untuk tabel `institutions`
--
ALTER TABLE `institutions`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indeks untuk tabel `laboratory_equipments`
--
ALTER TABLE `laboratory_equipments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `laboratory_equipments_laboratory_room_id_foreign` (`laboratory_room_id`);

--
-- Indeks untuk tabel `laboratory_materials`
--
ALTER TABLE `laboratory_materials`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `laboratory_materials_code_unique` (`code`),
  ADD KEY `laboratory_materials_laboratory_room_id_foreign` (`laboratory_room_id`);

--
-- Indeks untuk tabel `laboratory_rooms`
--
ALTER TABLE `laboratory_rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `laboratory_rooms_user_id_foreign` (`user_id`);

--
-- Indeks untuk tabel `laboratory_temporary_equipment`
--
ALTER TABLE `laboratory_temporary_equipment`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `majors`
--
ALTER TABLE `majors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `majors_faculty_id_foreign` (`faculty_id`);

--
-- Indeks untuk tabel `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indeks untuk tabel `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payable_index` (`payable_type`,`payable_id`),
  ADD KEY `payments_user_id_foreign` (`user_id`),
  ADD KEY `payments_verified_by_foreign` (`verified_by`);

--
-- Indeks untuk tabel `payment_items`
--
ALTER TABLE `payment_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payment_items_payment_id_foreign` (`payment_id`),
  ADD KEY `payable_index` (`payable_type`,`payable_id`);

--
-- Indeks untuk tabel `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indeks untuk tabel `practicums`
--
ALTER TABLE `practicums`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `practicums_code_unique` (`code`),
  ADD KEY `practicums_study_program_id_foreign` (`study_program_id`);

--
-- Indeks untuk tabel `practicum_approvals`
--
ALTER TABLE `practicum_approvals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `practicum_approvals_practicum_scheduling_id_foreign` (`practicum_scheduling_id`),
  ADD KEY `practicum_approvals_approver_id_foreign` (`approver_id`);

--
-- Indeks untuk tabel `practicum_classes`
--
ALTER TABLE `practicum_classes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `practicum_classes_practicum_scheduling_id_foreign` (`practicum_scheduling_id`),
  ADD KEY `practicum_classes_lecturer_id_foreign` (`lecturer_id`),
  ADD KEY `practicum_classes_laboratory_room_id_foreign` (`laboratory_room_id`);

--
-- Indeks untuk tabel `practicum_modules`
--
ALTER TABLE `practicum_modules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `practicum_modules_practicum_id_foreign` (`practicum_id`);

--
-- Indeks untuk tabel `practicum_schedulings`
--
ALTER TABLE `practicum_schedulings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `practicum_schedulings_academic_year_id_foreign` (`academic_year_id`),
  ADD KEY `practicum_schedulings_user_id_foreign` (`user_id`),
  ADD KEY `practicum_schedulings_laboran_id_foreign` (`laboran_id`),
  ADD KEY `practicum_schedulings_practicum_id_foreign` (`practicum_id`);

--
-- Indeks untuk tabel `practicum_scheduling_equipment`
--
ALTER TABLE `practicum_scheduling_equipment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `practicum_scheduling_equipment_practicum_scheduling_id_foreign` (`practicum_scheduling_id`),
  ADD KEY `equipable_index` (`equipmentable_type`,`equipmentable_id`);

--
-- Indeks untuk tabel `practicum_scheduling_materials`
--
ALTER TABLE `practicum_scheduling_materials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `practicum_scheduling_materials_practicum_scheduling_id_foreign` (`practicum_scheduling_id`),
  ADD KEY `practicum_scheduling_materials_laboratory_material_id_foreign` (`laboratory_material_id`);

--
-- Indeks untuk tabel `practicum_sessions`
--
ALTER TABLE `practicum_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `practicum_sessions_practicum_class_id_foreign` (`practicum_class_id`),
  ADD KEY `practicum_sessions_practicum_module_id_foreign` (`practicum_module_id`);

--
-- Indeks untuk tabel `study_programs`
--
ALTER TABLE `study_programs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `study_programs_major_id_foreign` (`major_id`);

--
-- Indeks untuk tabel `testing_types`
--
ALTER TABLE `testing_types`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_study_program_id_foreign` (`study_program_id`),
  ADD KEY `users_institution_id_foreign` (`institution_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `academic_years`
--
ALTER TABLE `academic_years`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `booking_approvals`
--
ALTER TABLE `booking_approvals`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT untuk tabel `booking_equipment`
--
ALTER TABLE `booking_equipment`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `booking_materials`
--
ALTER TABLE `booking_materials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `faculties`
--
ALTER TABLE `faculties`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `institutions`
--
ALTER TABLE `institutions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT untuk tabel `laboratory_equipments`
--
ALTER TABLE `laboratory_equipments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `laboratory_materials`
--
ALTER TABLE `laboratory_materials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `laboratory_rooms`
--
ALTER TABLE `laboratory_rooms`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `laboratory_temporary_equipment`
--
ALTER TABLE `laboratory_temporary_equipment`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `majors`
--
ALTER TABLE `majors`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=117;

--
-- AUTO_INCREMENT untuk tabel `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `payment_items`
--
ALTER TABLE `payment_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT untuk tabel `practicums`
--
ALTER TABLE `practicums`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `practicum_approvals`
--
ALTER TABLE `practicum_approvals`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `practicum_classes`
--
ALTER TABLE `practicum_classes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `practicum_modules`
--
ALTER TABLE `practicum_modules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `practicum_schedulings`
--
ALTER TABLE `practicum_schedulings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `practicum_scheduling_equipment`
--
ALTER TABLE `practicum_scheduling_equipment`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `practicum_scheduling_materials`
--
ALTER TABLE `practicum_scheduling_materials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `practicum_sessions`
--
ALTER TABLE `practicum_sessions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `study_programs`
--
ALTER TABLE `study_programs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT untuk tabel `testing_types`
--
ALTER TABLE `testing_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_academic_year_id_foreign` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_laboran_id_foreign` FOREIGN KEY (`laboran_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_laboratory_room_id_foreign` FOREIGN KEY (`laboratory_room_id`) REFERENCES `laboratory_rooms` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `booking_approvals`
--
ALTER TABLE `booking_approvals`
  ADD CONSTRAINT `booking_approvals_approver_id_foreign` FOREIGN KEY (`approver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `booking_approvals_booking_id_foreign` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `booking_equipment`
--
ALTER TABLE `booking_equipment`
  ADD CONSTRAINT `booking_equipment_booking_id_foreign` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `booking_equipment_laboratory_equipment_id_foreign` FOREIGN KEY (`laboratory_equipment_id`) REFERENCES `laboratory_equipments` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `booking_materials`
--
ALTER TABLE `booking_materials`
  ADD CONSTRAINT `booking_materials_booking_id_foreign` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `booking_materials_laboratory_material_id_foreign` FOREIGN KEY (`laboratory_material_id`) REFERENCES `laboratory_materials` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `laboratory_equipments`
--
ALTER TABLE `laboratory_equipments`
  ADD CONSTRAINT `laboratory_equipments_laboratory_room_id_foreign` FOREIGN KEY (`laboratory_room_id`) REFERENCES `laboratory_rooms` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `laboratory_materials`
--
ALTER TABLE `laboratory_materials`
  ADD CONSTRAINT `laboratory_materials_laboratory_room_id_foreign` FOREIGN KEY (`laboratory_room_id`) REFERENCES `laboratory_rooms` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `laboratory_rooms`
--
ALTER TABLE `laboratory_rooms`
  ADD CONSTRAINT `laboratory_rooms_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `majors`
--
ALTER TABLE `majors`
  ADD CONSTRAINT `majors_faculty_id_foreign` FOREIGN KEY (`faculty_id`) REFERENCES `faculties` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payments_verified_by_foreign` FOREIGN KEY (`verified_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `payment_items`
--
ALTER TABLE `payment_items`
  ADD CONSTRAINT `payment_items_payment_id_foreign` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `practicums`
--
ALTER TABLE `practicums`
  ADD CONSTRAINT `practicums_study_program_id_foreign` FOREIGN KEY (`study_program_id`) REFERENCES `study_programs` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `practicum_approvals`
--
ALTER TABLE `practicum_approvals`
  ADD CONSTRAINT `practicum_approvals_approver_id_foreign` FOREIGN KEY (`approver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `practicum_approvals_practicum_scheduling_id_foreign` FOREIGN KEY (`practicum_scheduling_id`) REFERENCES `practicum_schedulings` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `practicum_classes`
--
ALTER TABLE `practicum_classes`
  ADD CONSTRAINT `practicum_classes_laboratory_room_id_foreign` FOREIGN KEY (`laboratory_room_id`) REFERENCES `laboratory_rooms` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `practicum_classes_lecturer_id_foreign` FOREIGN KEY (`lecturer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `practicum_classes_practicum_scheduling_id_foreign` FOREIGN KEY (`practicum_scheduling_id`) REFERENCES `practicum_schedulings` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `practicum_modules`
--
ALTER TABLE `practicum_modules`
  ADD CONSTRAINT `practicum_modules_practicum_id_foreign` FOREIGN KEY (`practicum_id`) REFERENCES `practicums` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `practicum_schedulings`
--
ALTER TABLE `practicum_schedulings`
  ADD CONSTRAINT `practicum_schedulings_academic_year_id_foreign` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `practicum_schedulings_laboran_id_foreign` FOREIGN KEY (`laboran_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `practicum_schedulings_practicum_id_foreign` FOREIGN KEY (`practicum_id`) REFERENCES `practicums` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `practicum_schedulings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `practicum_scheduling_equipment`
--
ALTER TABLE `practicum_scheduling_equipment`
  ADD CONSTRAINT `practicum_scheduling_equipment_practicum_scheduling_id_foreign` FOREIGN KEY (`practicum_scheduling_id`) REFERENCES `practicum_schedulings` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `practicum_scheduling_materials`
--
ALTER TABLE `practicum_scheduling_materials`
  ADD CONSTRAINT `practicum_scheduling_materials_laboratory_material_id_foreign` FOREIGN KEY (`laboratory_material_id`) REFERENCES `laboratory_materials` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `practicum_scheduling_materials_practicum_scheduling_id_foreign` FOREIGN KEY (`practicum_scheduling_id`) REFERENCES `practicum_schedulings` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `practicum_sessions`
--
ALTER TABLE `practicum_sessions`
  ADD CONSTRAINT `practicum_sessions_practicum_class_id_foreign` FOREIGN KEY (`practicum_class_id`) REFERENCES `practicum_classes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `practicum_sessions_practicum_module_id_foreign` FOREIGN KEY (`practicum_module_id`) REFERENCES `practicum_modules` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `study_programs`
--
ALTER TABLE `study_programs`
  ADD CONSTRAINT `study_programs_major_id_foreign` FOREIGN KEY (`major_id`) REFERENCES `majors` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_institution_id_foreign` FOREIGN KEY (`institution_id`) REFERENCES `institutions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `users_study_program_id_foreign` FOREIGN KEY (`study_program_id`) REFERENCES `study_programs` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
