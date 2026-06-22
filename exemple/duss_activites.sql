-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql-duss.alwaysdata.net
-- Generation Time: Jun 22, 2026 at 07:18 PM
-- Server version: 10.11.18-MariaDB
-- PHP Version: 8.4.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `duss_activites`
--

-- --------------------------------------------------------

--
-- Table structure for table `Activite`
--

CREATE TABLE `Activite` (
  `No_Act` int(11) NOT NULL,
  `Type_Act` int(11) DEFAULT NULL,
  `Name_Act` varchar(48) NOT NULL,
  `No_dImg` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Activite`
--

INSERT INTO `Activite` (`No_Act`, `Type_Act`, `Name_Act`, `No_dImg`) VALUES
(1, 1, 'ARCHI : Pont à poutre', 1),
(2, 1, 'ARCHI : Pont en arc', 2),
(3, 1, 'ARCHI : Pont suspendu', 3),
(4, 1, 'Analyse d\'un système', 4),
(5, 1, 'Chaine d\'énergie - Trottinette', 5),
(6, 1, 'Chaine d\'énergie - Ex 1', 6),
(7, 1, 'Chaine d\'énergie - Ex 2', 7),
(8, 1, 'Chaine d\'énergie - Ex 3', 8),
(9, 1, 'Dessin technique - Vues', 9),
(10, 1, 'Habitat - Matériaux', 10),
(11, 2, 'DIAPO - Un ordinateur', 11),
(12, 2, 'BlocksCAD', 0),
(13, 1, 'Les périphériques informatiques - 2', 14),
(14, 2, 'Scratch', 0),
(15, 1, 'Réseau info Act-1', 13),
(16, 1, 'Les périphériques informatiques - 1', 15),
(17, 1, 'Les périphériques informatiques - 3', 15),
(18, 1, 'Objet Technique', 16),
(19, 2, 'Organigramme 1', 0),
(20, 1, 'Type de pont', 17),
(21, 2, 'Al Kindi', 0),
(22, 2, 'Algobolcs', 0),
(23, 2, 'Texte ASCII en : Hex, Binaire', 0),
(24, 2, 'Num. Chap 1', 0),
(25, 2, 'Num. Chap 2', 0),
(26, 2, 'Doc. Ponts en acier', 0),
(27, 2, 'Doc. Ponts en pierre', 0),
(28, 2, 'Doc. Capteurs', 0),
(29, 2, 'Doc. Actionneurs', 0),
(30, 2, 'Carte mentale ID Num.', 0),
(31, 2, 'Habitat - Evolution', 0),
(32, 2, 'Frise chrono.', 0),
(33, 2, 'ID Construction', 0),
(34, 2, 'Vidéo - Evol. Habitat', 0),
(35, 2, 'Type de Construction', 0),
(36, 1, 'Style Archi. 1', 18),
(37, 1, 'Style Archi. 2', 19),
(38, 2, 'Taille Image', 0),
(39, 2, 'Carte Mentale', 0),
(41, 2, 'Données Num.', 0),
(42, 2, '4S2- ID Num.', 0),
(43, 1, 'Habitat - Réseau eau', 20),
(44, 1, 'Habitat - Chauffage', 21),
(45, 1, 'Habitat - Réseau électrique', 23),
(46, 1, 'Habitat - Réseau com. ', 24),
(47, 2, '4S1- Les graphes', 0),
(48, 2, '5S1- Frise', 0),
(49, 2, '5S2- Fonctions', 0),
(50, 2, 'Hachage Chiffrage', 0),
(51, 1, 'Démarche de projet', 25),
(52, 2, 'La démarche de Projet', 0),
(53, 1, 'Démarche de projet - Ex', 26),
(54, 2, 'Réseau S1', 0),
(55, 2, 'Réseau S2', 0),
(56, 1, 'Réseau info Act-2', 27),
(57, 2, '5S3- Le Plan', 0),
(58, 2, '5S4- Permis de construire', 0),
(60, 2, '4S- Symboles Algo', 0),
(61, 2, 'Chaines fonctionnelles', 0),
(62, 1, 'Les Energies', 28),
(63, 1, 'Chaine d\'énergie - Moto', 29),
(64, 2, 'Fiche Brevet - Formes des Energies ', 0),
(65, 2, 'Fiche Brevet - Chaînes fonctionnelles', 0),
(66, 2, 'Fiche Brevet - Expression du besoin', 0),
(67, 2, 'Fiche Brevet - Besoin Contraintes ', 0),
(68, 2, 'Fiche Brevet - Besoin exemples', 0),
(69, 2, 'Fiche Brevet - Organigramme', 0),
(70, 2, 'Fiche Brevet - Programmation', 0),
(71, 2, 'Fiche Brevet - Architecture Reseau', 0),
(72, 2, 'Fiche Brevet - Capteur et Actionneur', 0),
(73, 2, 'Fiche Brevet - Algorithme', 0),
(74, 2, 'Fiche Brevet - Objets connectés', 0),
(75, 2, 'Fiche Brevet - Prototype', 0),
(76, 2, 'Fiche Brevet - Cahier des charges CDCF', 0),
(77, 2, 'Un robot en ville...', 0),
(78, 2, 'Mindmaps', 0),
(79, 2, 'Conv. HEXA BIN - Ex 1', 0),
(80, 2, '5s1-BlocksCAD', 0),
(81, 2, 'Machine Enigma', 0),
(82, 2, 'Dessin Synth Boxer', 0),
(83, 2, 'Dessin-Exercices', 0),
(84, 2, 'Programmation-Synthèse', 0),
(85, 2, 'Organigramme - Synthèse', 0),
(86, 1, 'Chaine dénergie - Scooter', 30);

-- --------------------------------------------------------

--
-- Table structure for table `Act_Attrib`
--

CREATE TABLE `Act_Attrib` (
  `No-Act_Attrib` int(11) NOT NULL,
  `No_Niv_Attrib` int(11) NOT NULL,
  `No_Act_Attrib` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Act_Attrib`
--

INSERT INTO `Act_Attrib` (`No-Act_Attrib`, `No_Niv_Attrib`, `No_Act_Attrib`) VALUES
(2, 2, 12),
(3, 3, 12),
(4, 4, 12),
(21, 4, 9),
(27, 3, 9),
(29, 1, 14),
(30, 4, 15),
(38, 4, 19),
(41, 1, 12),
(46, 4, 21),
(47, 4, 22),
(48, 4, 23),
(56, 2, 32),
(58, 3, 32),
(59, 4, 32),
(69, 3, 39),
(97, 4, 56),
(127, 4, 60),
(128, 1, 39),
(129, 2, 39),
(130, 4, 39),
(131, 4, 29),
(132, 4, 28),
(133, 2, 14),
(134, 3, 14),
(135, 4, 14),
(137, 4, 79),
(138, 4, 24),
(139, 4, 25),
(140, 3, 77),
(141, 4, 73),
(142, 4, 71),
(145, 4, 74),
(146, 4, 69),
(147, 3, 41),
(148, 3, 30),
(149, 2, 80),
(150, 3, 15),
(151, 3, 54),
(153, 2, 9),
(154, 3, 55),
(155, 4, 50),
(156, 3, 60),
(157, 3, 19),
(158, 4, 81),
(159, 2, 82),
(160, 2, 83),
(161, 4, 70),
(162, 4, 84),
(163, 3, 85),
(164, 3, 69),
(165, 4, 6),
(166, 4, 7),
(167, 4, 8),
(168, 4, 63),
(169, 4, 5),
(170, 4, 86),
(171, 4, 61),
(172, 3, 29),
(173, 3, 28),
(174, 4, 65),
(175, 4, 64),
(176, 4, 62),
(177, 1, 16),
(178, 1, 13),
(179, 1, 17),
(180, 3, 47),
(181, 3, 42),
(182, 4, 4),
(183, 3, 78);

-- --------------------------------------------------------

--
-- Table structure for table `Attrib_Chap`
--

CREATE TABLE `Attrib_Chap` (
  `No_Attrib` int(11) NOT NULL,
  `No_dChap` int(11) NOT NULL,
  `No_dAct` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Attrib_Chap`
--

INSERT INTO `Attrib_Chap` (`No_Attrib`, `No_dChap`, `No_dAct`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 2, 4),
(6, 2, 6),
(7, 2, 7),
(8, 2, 8),
(9, 2, 9),
(10, 2, 10),
(11, 3, 11),
(12, 4, 12),
(16, 3, 13),
(17, 4, 14),
(18, 3, 15),
(19, 4, 0),
(20, 3, 16),
(21, 3, 17),
(22, 2, 18),
(23, 2, 19),
(25, 4, 21),
(26, 4, 22),
(28, 21, 24),
(29, 21, 25),
(34, 21, 30),
(35, 4, 32),
(37, 21, 33),
(38, 1, 36),
(39, 22, 29),
(40, 22, 28),
(41, 22, 26),
(42, 22, 27),
(44, 22, 23),
(45, 22, 31),
(46, 22, 34),
(47, 1, 37),
(49, 21, 35),
(50, 1, 20),
(51, 4, 39),
(52, 21, 40),
(53, 21, 41),
(54, 21, 42),
(55, 22, 38),
(56, 1, 43),
(57, 1, 44),
(58, 1, 45),
(59, 1, 46),
(60, 21, 47),
(61, 21, 48),
(62, 21, 49),
(63, 21, 50),
(64, 2, 51),
(65, 21, 52),
(66, 2, 53),
(67, 21, 54),
(68, 21, 55),
(69, 3, 56),
(70, 21, 57),
(71, 21, 58),
(72, 21, 59),
(73, 21, 60),
(74, 2, 61),
(75, 2, 62),
(76, 1, 63),
(77, 1, 5),
(78, 21, 64),
(79, 21, 73),
(80, 21, 71),
(81, 21, 67),
(82, 21, 68),
(83, 21, 76),
(84, 21, 72),
(85, 21, 65),
(86, 21, 66),
(87, 21, 74),
(88, 21, 69),
(89, 21, 70),
(90, 21, 75),
(91, 22, 77),
(92, 3, 79),
(93, 2, 80),
(94, 1, 81),
(95, 2, 82),
(96, 2, 83),
(97, 2, 84),
(98, 21, 85),
(99, 1, 86);

-- --------------------------------------------------------

--
-- Table structure for table `Attrib_Niv`
--

CREATE TABLE `Attrib_Niv` (
  `No_Niv_Attrib` int(11) NOT NULL,
  `No_dChap` int(11) NOT NULL,
  `No_dNiv` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Attrib_Niv`
--

INSERT INTO `Attrib_Niv` (`No_Niv_Attrib`, `No_dChap`, `No_dNiv`) VALUES
(5, 4, 3),
(6, 4, 4),
(7, 2, 1),
(8, 2, 4),
(9, 3, 1),
(11, 3, 4),
(12, 2, 3),
(13, 3, 3),
(14, 4, 1),
(16, 21, 4),
(18, 21, 3),
(19, 22, 4),
(21, 22, 3),
(22, 21, 2),
(23, 1, 2),
(24, 4, 2),
(25, 2, 2),
(26, 22, 2),
(27, 1, 3),
(28, 1, 4),
(29, 3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `Chap`
--

CREATE TABLE `Chap` (
  `No_chap` int(11) NOT NULL,
  `Name_Chap` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Chap`
--

INSERT INTO `Chap` (`No_chap`, `Name_Chap`) VALUES
(1, 'Etude d\'objet technique'),
(2, 'Méthode et Analyse'),
(3, 'Le numérique'),
(4, 'Les logiciels'),
(21, 'Cours'),
(22, 'Ressources');

-- --------------------------------------------------------

--
-- Table structure for table `Etiquettes`
--

CREATE TABLE `Etiquettes` (
  `No_Etiqu` int(11) NOT NULL,
  `x` int(11) NOT NULL,
  `y` int(11) NOT NULL,
  `No_liste` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Etiquettes`
--

INSERT INTO `Etiquettes` (`No_Etiqu`, `x`, `y`, `No_liste`) VALUES
(1, 750, 500, 1),
(2, 250, 470, 2),
(3, 370, 190, 3),
(4, 80, 235, 4),
(5, 280, 510, 5),
(6, 940, 405, 6),
(7, 780, 200, 7),
(8, 650, 180, 8),
(9, 405, 540, 9),
(10, 520, 370, 10),
(11, 170, 185, 11),
(12, 80, 280, 12),
(13, 400, 150, 13),
(14, 490, 265, 14),
(15, 940, 405, 15),
(16, 800, 525, 16),
(17, 200, 500, 17),
(18, 351, 268, 18),
(19, 518, 268, 19),
(20, 698, 267, 20),
(21, 263, 472, 21),
(22, 430, 473, 22),
(23, 594, 472, 23),
(24, 762, 471, 24),
(25, 470, 215, 25),
(26, 645, 195, 26),
(27, 775, 195, 27),
(28, 830, 225, 28),
(29, 380, 455, 29),
(30, 525, 475, 30),
(31, 600, 515, 31),
(32, 790, 515, 32),
(33, 250, 150, 33),
(34, 435, 150, 34),
(35, 615, 150, 35),
(36, 800, 150, 36),
(37, 90, 240, 37),
(38, 1020, 240, 38),
(39, 250, 140, 42),
(40, 435, 140, 43),
(41, 615, 140, 44),
(42, 800, 140, 45),
(43, 90, 235, 46),
(44, 1020, 235, 49),
(45, 195, 150, 51),
(46, 400, 150, 52),
(47, 605, 150, 53),
(48, 810, 150, 54),
(49, 80, 250, 59),
(50, 960, 250, 57),
(51, 560, 400, 60),
(52, 560, 577, 61),
(53, 560, 282, 62),
(54, 820, 400, 63),
(55, 307, 400, 64),
(56, 180, 272, 65),
(57, 282, 297, 66),
(58, 385, 272, 67),
(59, 485, 297, 68),
(60, 585, 272, 69),
(61, 680, 297, 70),
(62, 775, 272, 71),
(63, 870, 297, 72),
(64, 975, 272, 73),
(66, 594, 115, 75),
(67, 746, 333, 76),
(68, 849, 584, 77),
(69, 662, 560, 78),
(70, 342, 365, 79),
(71, 659, 478, 80),
(72, 829, 207, 81),
(73, 302, 162, 82),
(74, 415, 550, 83),
(75, 137, 513, 84),
(76, 138, 469, 85),
(77, 140, 558, 86),
(78, 139, 598, 87),
(79, 203, 354, 89),
(80, 384, 377, 91),
(81, 560, 355, 92),
(82, 415, 359, 93),
(83, 559, 194, 94),
(84, 154, 213, 95),
(85, 185, 394, 96),
(86, 297, 458, 97),
(87, 171, 552, 98),
(88, 473, 478, 99),
(89, 633, 474, 100),
(90, 661, 315, 101),
(91, 857, 208, 102),
(92, 852, 424, 103),
(104, 247, 393, 115),
(105, 478, 487, 116),
(106, 531, 182, 117),
(107, 201, 264, 115),
(108, 668, 308, 115),
(109, 172, 549, 115),
(110, 644, 467, 115),
(111, 852, 524, 116),
(112, 865, 219, 116),
(113, 482, 345, 116),
(114, 396, 537, 115),
(115, 481, 434, 122),
(116, 608, 339, 122),
(117, 627, 293, 122),
(118, 598, 152, 123),
(119, 717, 200, 123),
(120, 799, 246, 123),
(121, 571, 387, 123),
(122, 535, 481, 123),
(123, 512, 527, 123),
(124, 687, 386, 124),
(125, 511, 287, 125),
(126, 406, 436, 126),
(127, 440, 362, 127),
(128, 748, 217, 128),
(129, 403, 518, 129),
(130, 439, 146, 130),
(131, 772, 145, 131),
(132, 604, 372, 132),
(133, 928, 174, 133),
(134, 384, 162, 134),
(135, 472, 369, 135),
(136, 248, 303, 136),
(137, 778, 246, 137),
(138, 780, 317, 138),
(139, 779, 375, 139),
(140, 248, 442, 140),
(141, 640, 150, 141),
(142, 256, 191, 142),
(143, 246, 340, 143),
(144, 245, 379, 144),
(145, 779, 285, 145),
(146, 704, 545, 146),
(147, 779, 402, 147),
(148, 779, 432, 148),
(149, 501, 547, 149),
(150, 245, 581, 150),
(151, 809, 131, 151),
(152, 809, 156, 152),
(153, 808, 182, 153),
(154, 608, 133, 154),
(155, 360, 190, 155),
(156, 297, 331, 156),
(157, 820, 168, 157),
(158, 821, 213, 158),
(159, 820, 431, 159),
(160, 820, 403, 160),
(161, 240, 391, 161),
(162, 239, 443, 162),
(163, 817, 313, 163),
(164, 240, 417, 164),
(165, 818, 456, 165),
(166, 290, 242, 166),
(167, 288, 269, 167),
(168, 799, 288, 168),
(169, 798, 359, 169),
(170, 799, 395, 170),
(171, 333, 342, 171),
(172, 799, 432, 172),
(173, 800, 529, 173),
(174, 799, 580, 174),
(175, 294, 559, 175),
(176, 294, 521, 176),
(177, 295, 484, 177),
(178, 295, 372, 178),
(179, 296, 259, 179),
(180, 296, 456, 180),
(181, 804, 274, 181),
(182, 804, 418, 182),
(183, 804, 393, 183),
(184, 805, 474, 184),
(185, 796, 127, 185),
(186, 806, 361, 186),
(187, 288, 269, 187),
(188, 291, 358, 188),
(189, 291, 328, 189),
(190, 804, 443, 190),
(191, 257, 384, 191),
(192, 245, 411, 192),
(193, 517, 567, 193),
(194, 334, 584, 194),
(195, 805, 521, 195),
(196, 804, 549, 196),
(197, 228, 162, 197),
(198, 191, 232, 198),
(199, 195, 395, 199),
(200, 723, 483, 200),
(201, 197, 545, 201),
(202, 723, 206, 202),
(203, 723, 419, 203),
(204, 723, 271, 204),
(205, 735, 552, 205),
(215, 304, 267, 215),
(216, 844, 200, 215),
(217, 840, 335, 215),
(218, 317, 428, 216),
(219, 836, 462, 216),
(220, 135, 629, 217),
(221, 831, 616, 217),
(222, 862, 497, 218),
(223, 500, 394, 219),
(224, 863, 565, 219),
(225, 501, 535, 220),
(226, 864, 531, 221),
(227, 502, 570, 221),
(228, 499, 428, 221),
(229, 147, 529, 221),
(230, 146, 563, 220),
(231, 252, 529, 222),
(232, 766, 531, 223),
(233, 759, 376, 224),
(234, 759, 343, 225),
(235, 758, 190, 226),
(236, 254, 361, 227),
(237, 258, 190, 227),
(238, 387, 130, 228),
(239, 393, 498, 229),
(240, 797, 506, 230),
(241, 194, 287, 231),
(242, 364, 178, 232),
(243, 365, 598, 233),
(244, 773, 574, 234),
(245, 192, 396, 235),
(246, 290, 410, 236),
(247, 290, 460, 237),
(248, 290, 510, 238),
(249, 290, 560, 239);

-- --------------------------------------------------------

--
-- Table structure for table `Img`
--

CREATE TABLE `Img` (
  `No_Img` int(11) NOT NULL,
  `N_Img` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Img`
--

INSERT INTO `Img` (`No_Img`, `N_Img`) VALUES
(1, '201'),
(2, '202'),
(3, '203'),
(4, '100'),
(5, '106'),
(6, '101'),
(7, '102'),
(8, '103'),
(9, '104'),
(10, '105'),
(13, '300'),
(14, '600'),
(15, '601'),
(16, '602'),
(17, '204'),
(18, '400'),
(19, '401'),
(20, '410'),
(21, '411'),
(23, '412'),
(24, '413'),
(25, '500'),
(26, '501'),
(27, '560'),
(28, '414'),
(29, '415'),
(30, '107');

-- --------------------------------------------------------

--
-- Table structure for table `Liens`
--

CREATE TABLE `Liens` (
  `No_Lien` int(11) NOT NULL,
  `No_dAct` int(11) DEFAULT NULL,
  `Link` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Liens`
--

INSERT INTO `Liens` (`No_Lien`, `No_dAct`, `Link`) VALUES
(1, 11, './other/301.odp'),
(2, 12, 'https://www.blockscad3d.com/editor/?lang=fr'),
(3, 14, 'https://scratch.mit.edu/'),
(6, 21, 'https://epreuve.concours-alkindi.fr/'),
(7, 22, 'https://www.algoblocs.fr/'),
(8, 23, 'https://www.rapidtables.org/fr/convert/number/ascii-hex-bin-dec-converter.html'),
(9, 24, 'http://duss.alwaysdata.net/qcm/cours/3/chap1.pdf'),
(10, 25, 'http://duss.alwaysdata.net/qcm/cours/3/chap2.pdf'),
(11, 19, 'http://duss.alwaysdata.net/qcm/exorgani/'),
(12, 26, 'http://duss.alwaysdata.net/qcm/cours/5/Pontsacier.pdf'),
(13, 27, 'http://duss.alwaysdata.net/qcm/cours/5/PontsPierre.pdf'),
(14, 29, 'http://duss.alwaysdata.net/qcm/cours/4/ressource-actionneurs.pdf'),
(15, 28, 'http://duss.alwaysdata.net/qcm/cours/4/ressource-capteurs.pdf'),
(16, 30, 'http://duss.alwaysdata.net/qcm/cours/4/Preserver son identite sur le Net.pdf'),
(17, 31, 'http://duss.alwaysdata.net/qcm/cours/5/evolutionhabitat.pdf'),
(18, 32, 'http://www.frisechronos.fr/'),
(19, 33, 'http://duss.alwaysdata.net/qcm/cours/5/Fiche_Identite_construction.pdf'),
(20, 34, 'https://youtu.be/_pUnOfsk_fs?feature=shared'),
(21, 39, 'https://www.mindmaps.app/'),
(22, 38, 'http://duss.alwaysdata.net/qcm/cours/3/paint_taille.pdf'),
(25, 35, 'http://duss.alwaysdata.net/qcm/cours/5/Categorie_Construction_immobiliere.pdf'),
(26, 42, 'http://duss.alwaysdata.net/qcm/cours/4/conseil-NET.pdf'),
(27, 41, 'http://duss.alwaysdata.net/qcm/cours/4/donnees-1.pdf'),
(29, 47, 'http://duss.alwaysdata.net/qcm/cours/4/4graph1.pdf'),
(30, 48, 'http://duss.alwaysdata.net/qcm/cours/5/5s1.pdf'),
(31, 49, 'http://duss.alwaysdata.net/qcm/cours/5/5s2.pdf'),
(32, 50, 'http://duss.alwaysdata.net/qcm/cours/3/s1_Hachage_Chiffre.pdf'),
(33, 52, 'http://duss.alwaysdata.net/qcm/cours/3/demarche_projet.pdf'),
(34, 54, 'http://duss.alwaysdata.net/qcm/cours/4/reseau_1.pdf'),
(35, 55, 'http://duss.alwaysdata.net/qcm/cours/4/reseau_2.pdf'),
(36, 57, 'http://duss.alwaysdata.net/qcm/cours/5/5s3.pdf'),
(37, 58, 'http://duss.alwaysdata.net/qcm/cours/5/5s4.pdf'),
(38, 60, 'http://duss.alwaysdata.net/qcm/cours/4/algo1.pdf'),
(39, 61, 'https://youtu.be/WsfFdcqdAsk?si=nr_wYgi3m6V2kii8'),
(40, 64, 'http://duss.alwaysdata.net/qcm/cours/3/fiches_brevet/1_MSOST13_Chaine-energie_Chaine-info jl.pdf'),
(41, 66, 'http://duss.alwaysdata.net/qcm/cours/3/fiches_brevet/2_DIC11_Besoin-bete-Е-cornes.pdf'),
(42, 67, 'http://duss.alwaysdata.net/qcm/cours/3/fiches_brevet/2_DIC11_Besoin-contrainte-norme jl.pdf'),
(43, 68, 'http://duss.alwaysdata.net/qcm/cours/3/fiches_brevet/2_DIC11-exemples-d\'analyse du besoin.pdf'),
(44, 70, 'http://duss.alwaysdata.net/qcm/cours/3/fiches_brevet/4_IP23-2-3_Progr_par_bloc_ou_progr_par_organigramme jl.pdf'),
(45, 71, 'http://duss.alwaysdata.net/qcm/cours/3/fiches_brevet/5_IP11-1_Architecture-reseau-internet jl.pdf'),
(46, 72, 'http://duss.alwaysdata.net/qcm/cours/3/fiches_brevet/6_MSOST144-IP23_capteur-actionneur-interface jl.pdf'),
(47, 73, 'http://duss.alwaysdata.net/qcm/cours/3/fiches_brevet/7_DIC15-4-OTSCIS21-IP23_Algorithme jl.pdf'),
(48, 74, 'http://duss.alwaysdata.net/qcm/cours/3/fiches_brevet/9_CT1.3-CT2.5-DIC1.5-objets connectВs.pdf'),
(49, 75, 'http://duss.alwaysdata.net/qcm/cours/3/fiches_brevet/10_CT2.6-DIC 2.1-rВaliser un prototype.pdf'),
(50, 76, 'http://duss.alwaysdata.net/qcm/cours/3/fiches_brevet/11_DIC11-CDCF.pdf'),
(51, 65, 'http://duss.alwaysdata.net/qcm/cours/3/fiches_brevet/1_MSOST13_Chaine-energie_Chaine-info jl.pdf'),
(52, 69, 'http://duss.alwaysdata.net/qcm/cours/3/fiches_brevet/3_DIC15-4-OTSCIS21-IP23_Organigramme ou logigramme jl.pdf'),
(53, 77, 'http://duss.alwaysdata.net/qcm/cours/5/movie/ozobot.mp4'),
(54, 78, 'https://www.mindmaps.app/'),
(55, 79, 'https://duss.alwaysdata.net/qcm/hexabin/'),
(56, 80, 'http://duss.alwaysdata.net/qcm/cours/5/5s1_Blockscad3d.pdf'),
(57, 81, 'https://observablehq.com/@tmcw/enigma-machine'),
(58, 82, 'http://duss.alwaysdata.net/qcm/cours/5/5dess1.pdf'),
(59, 83, 'http://duss.alwaysdata.net/qcm/cours/5/exercice-dessin-technique.pdf'),
(61, 84, 'https://duss.alwaysdata.net/myfiles/api/public/dl/RD4rDpt-'),
(62, 85, 'https://duss.alwaysdata.net/myfiles/share/I9pEkaf-');

-- --------------------------------------------------------

--
-- Table structure for table `Listes`
--

CREATE TABLE `Listes` (
  `No_Liste` int(11) NOT NULL,
  `Act_liste` int(11) NOT NULL,
  `Num_Liste_Base` int(11) NOT NULL,
  `Num_Liste_Act` int(11) NOT NULL,
  `Num_Rep` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Listes`
--

INSERT INTO `Listes` (`No_Liste`, `Act_liste`, `Num_Liste_Base`, `Num_Liste_Act`, `Num_Rep`) VALUES
(1, 1, 0, 0, 10),
(2, 1, 0, 0, 49),
(3, 1, 0, 0, 13),
(4, 1, 0, 0, 53),
(5, 1, 0, 0, 39),
(6, 1, 0, 0, 14),
(7, 1, 0, 0, 7),
(8, 2, 1, 0, 13),
(9, 2, 1, 0, 53),
(10, 2, 1, 0, 3),
(11, 2, 1, 0, 51),
(12, 3, 2, 0, 34),
(13, 3, 2, 0, 1),
(14, 3, 2, 0, 12),
(15, 3, 2, 0, 53),
(16, 3, 2, 0, 39),
(17, 3, 2, 0, 29),
(18, 4, 3, 0, 27),
(19, 4, 3, 0, 15),
(20, 4, 3, 0, 45),
(21, 4, 4, 1, 28),
(22, 4, 4, 1, 11),
(23, 4, 4, 1, 37),
(24, 4, 4, 1, 26),
(25, 5, 5, 0, 28),
(26, 5, 5, 0, 11),
(27, 5, 5, 0, 37),
(28, 5, 5, 0, 26),
(29, 5, 6, 1, 4),
(30, 5, 6, 1, 5),
(31, 5, 6, 1, 40),
(32, 5, 6, 1, 17),
(33, 6, 7, 0, 43),
(34, 6, 7, 0, 9),
(35, 6, 7, 0, 40),
(36, 6, 7, 0, 22),
(37, 6, 8, 1, 33),
(38, 6, 8, 1, 47),
(39, 6, 8, 1, 50),
(40, 6, 8, 1, 6),
(41, 6, 8, 1, 20),
(42, 7, 9, 0, 46),
(43, 7, 9, 0, 9),
(44, 7, 9, 0, 21),
(45, 7, 9, 0, 41),
(46, 7, 10, 1, 33),
(47, 7, 10, 1, 47),
(48, 7, 10, 1, 50),
(49, 7, 10, 1, 6),
(50, 7, 10, 1, 20),
(51, 8, 11, 0, 32),
(52, 8, 11, 0, 19),
(53, 8, 11, 0, 24),
(54, 8, 11, 0, 23),
(55, 8, 12, 1, 33),
(56, 8, 12, 1, 47),
(57, 8, 12, 1, 50),
(58, 8, 12, 1, 6),
(59, 8, 12, 1, 20),
(60, 9, 13, 0, 42),
(61, 9, 13, 0, 31),
(62, 9, 13, 0, 36),
(63, 9, 13, 0, 44),
(64, 9, 13, 0, 38),
(65, 10, 14, 0, 25),
(66, 10, 14, 0, 35),
(67, 10, 14, 0, 8),
(68, 10, 14, 0, 16),
(69, 10, 14, 0, 48),
(70, 10, 14, 0, 2),
(71, 10, 14, 0, 52),
(72, 10, 14, 0, 18),
(73, 10, 14, 0, 30),
(75, 15, 15, 0, 58),
(76, 15, 15, 0, 63),
(77, 15, 15, 0, 64),
(78, 15, 15, 0, 61),
(79, 15, 15, 0, 60),
(80, 15, 15, 0, 62),
(81, 15, 15, 0, 57),
(82, 15, 15, 0, 56),
(83, 15, 15, 0, 59),
(84, 15, 16, 1, 66),
(85, 15, 16, 1, 65),
(86, 15, 16, 1, 5),
(87, 15, 16, 1, 68),
(88, 13, 17, 0, 73),
(89, 13, 17, 0, 69),
(90, 13, 17, 0, 72),
(91, 13, 17, 0, 71),
(92, 13, 17, 0, 70),
(93, 16, 18, 0, 60),
(94, 16, 19, 0, 61),
(95, 16, 20, 0, 74),
(96, 16, 20, 0, 75),
(97, 16, 20, 0, 77),
(98, 16, 20, 0, 76),
(99, 16, 20, 0, 78),
(100, 16, 20, 0, 79),
(101, 16, 20, 0, 80),
(102, 16, 20, 0, 81),
(103, 16, 20, 0, 82),
(115, 17, 21, 0, 70),
(116, 17, 21, 0, 69),
(117, 17, 21, 0, 71),
(122, 18, 22, 0, 84),
(123, 18, 22, 0, 83),
(124, 15, 15, 0, 85),
(125, 20, 23, 0, 88),
(126, 20, 23, 0, 87),
(127, 20, 23, 0, 86),
(128, 20, 23, 0, 90),
(129, 20, 23, 0, 89),
(130, 36, 24, 0, 91),
(131, 36, 24, 0, 92),
(132, 36, 24, 0, 93),
(133, 37, 25, 0, 97),
(134, 37, 25, 0, 96),
(135, 37, 25, 0, 98),
(136, 43, 26, 0, 100),
(137, 43, 26, 0, 108),
(138, 43, 26, 0, 106),
(139, 43, 26, 0, 114),
(140, 43, 26, 0, 101),
(141, 43, 27, 1, 115),
(142, 43, 27, 1, 99),
(143, 43, 27, 1, 112),
(144, 43, 27, 1, 24),
(145, 43, 28, 2, 107),
(146, 43, 28, 2, 113),
(147, 43, 28, 2, 105),
(148, 43, 28, 2, 104),
(149, 43, 29, 3, 103),
(150, 43, 29, 3, 102),
(151, 43, 30, 4, 109),
(152, 43, 30, 4, 110),
(153, 43, 30, 4, 111),
(154, 44, 31, 0, 123),
(155, 44, 31, 0, 124),
(156, 44, 31, 0, 116),
(157, 44, 32, 1, 115),
(158, 44, 32, 1, 99),
(159, 44, 32, 1, 24),
(160, 44, 32, 1, 121),
(161, 44, 33, 2, 117),
(162, 44, 33, 2, 119),
(163, 44, 33, 2, 120),
(164, 44, 33, 2, 118),
(165, 44, 33, 2, 122),
(166, 44, 34, 3, 109),
(167, 44, 34, 3, 110),
(168, 45, 35, 0, 130),
(169, 45, 35, 0, 131),
(170, 45, 35, 0, 132),
(171, 45, 35, 0, 126),
(172, 45, 35, 0, 133),
(173, 45, 35, 0, 114),
(174, 45, 36, 1, 134),
(175, 45, 36, 1, 4),
(176, 45, 36, 1, 129),
(177, 45, 36, 1, 135),
(178, 45, 36, 1, 127),
(179, 45, 36, 1, 125),
(180, 45, 36, 1, 128),
(181, 46, 37, 0, 136),
(182, 46, 37, 0, 138),
(183, 46, 37, 0, 137),
(184, 46, 37, 0, 140),
(185, 46, 37, 0, 150),
(186, 46, 38, 1, 130),
(187, 46, 38, 1, 149),
(188, 46, 38, 1, 147),
(189, 46, 38, 1, 148),
(190, 46, 38, 1, 139),
(191, 46, 39, 2, 146),
(192, 46, 39, 2, 145),
(193, 46, 39, 2, 143),
(194, 46, 39, 2, 144),
(195, 46, 39, 2, 141),
(196, 46, 39, 2, 142),
(197, 51, 40, 0, 151),
(198, 51, 40, 0, 152),
(199, 51, 40, 0, 153),
(200, 51, 40, 0, 158),
(201, 51, 40, 0, 154),
(202, 51, 40, 0, 155),
(203, 51, 40, 0, 157),
(204, 51, 40, 0, 156),
(205, 51, 40, 0, 159),
(215, 53, 41, 0, 154),
(216, 53, 41, 0, 155),
(217, 53, 41, 0, 156),
(218, 56, 42, 0, 161),
(219, 56, 42, 0, 162),
(220, 56, 42, 0, 160),
(221, 56, 42, 0, 163),
(222, 62, 43, 0, 167),
(223, 62, 43, 0, 164),
(224, 62, 43, 0, 169),
(225, 62, 43, 0, 168),
(226, 62, 43, 0, 165),
(227, 62, 43, 0, 166),
(228, 63, 44, 0, 28),
(229, 63, 44, 0, 11),
(230, 63, 44, 0, 37),
(231, 63, 44, 0, 26),
(232, 63, 45, 1, 170),
(233, 63, 45, 1, 171),
(234, 63, 45, 1, 172),
(235, 63, 45, 1, 173),
(236, 86, 46, 0, 28),
(237, 86, 46, 0, 11),
(238, 86, 46, 0, 37),
(239, 86, 46, 0, 26);

-- --------------------------------------------------------

--
-- Table structure for table `Niveau`
--

CREATE TABLE `Niveau` (
  `No_Niv` int(11) NOT NULL,
  `Name_Niv` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Niveau`
--

INSERT INTO `Niveau` (`No_Niv`, `Name_Niv`) VALUES
(1, ' 6 ème'),
(2, '5 ème'),
(3, '4 ème'),
(4, '3 ème'),
(5, 'Bia');

-- --------------------------------------------------------

--
-- Table structure for table `Reponses`
--

CREATE TABLE `Reponses` (
  `No_Rep` int(11) NOT NULL,
  `Reponse` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Reponses`
--

INSERT INTO `Reponses` (`No_Rep`, `Reponse`) VALUES
(1, 'Câble porteur'),
(2, 'Ciment'),
(3, 'Arche principale'),
(4, 'Batterie'),
(5, 'Fils électriques'),
(6, 'Lumineuse'),
(7, 'Joint de dilatation'),
(8, 'Moellon'),
(9, 'Interrupteur'),
(10, 'Pile immergée'),
(11, 'Distribuer'),
(12, 'Suspente'),
(13, 'Tablier'),
(14, 'Système d\'appui'),
(15, 'Traiter'),
(16, 'Pierre de taille'),
(17, 'Courroie'),
(18, 'Brique de bois'),
(19, 'Circuit, Vanne et Injecteur'),
(20, 'Chimique'),
(21, 'Ampoule'),
(22, 'Réducteur + Tube'),
(23, 'Circuit, Circulateur et Façade'),
(24, 'Chaudière'),
(25, 'Brique cuite'),
(26, 'Transmettre'),
(27, 'Acquérir'),
(28, 'Stocker'),
(29, 'Pylône'),
(30, 'Botte de paille'),
(31, 'Vue de dessus'),
(32, 'Citerne de gaz'),
(33, 'Electrique'),
(34, 'Massif d\'ancrage'),
(35, 'Brique crue'),
(36, 'Vue de dessous'),
(37, 'Transformer'),
(38, 'Vue de droite'),
(39, 'Fondations'),
(40, 'Moteur électrique'),
(41, 'Pied + Réflecteur'),
(42, 'Vue de face'),
(43, 'Disjoncteur'),
(44, 'Vue de gauche'),
(45, 'Communiquer'),
(46, 'Prise secteur'),
(47, 'Mécanique'),
(48, 'Parpaing'),
(49, 'Pile émergée'),
(50, 'Thermique'),
(51, 'Pile de support'),
(52, 'Planche'),
(53, 'Culée'),
(56, 'PC (Tour)'),
(57, 'PC (Portable)'),
(58, 'Borne CPL'),
(59, 'Serveur'),
(60, 'Imprimante'),
(61, 'Modem'),
(62, 'Passerelle'),
(63, 'Borne WiFi'),
(64, 'Prise Téléphone'),
(65, 'Câble ethernet RJ45'),
(66, 'Câble Téléphone RJ11'),
(68, 'Ondes radios'),
(69, 'de sortie'),
(70, 'd\'entrée'),
(71, 'd\'entrée-sortie'),
(72, 'intérieurs'),
(73, 'de circulation'),
(74, 'Souris'),
(75, 'Clavier'),
(76, 'Manette de jeu'),
(77, 'Micro'),
(78, 'Ecran'),
(79, 'Scanner'),
(80, 'Webcam'),
(81, 'Ecouteurs'),
(82, 'Enceintes'),
(83, 'Vrai'),
(84, 'Faux'),
(85, 'Switch'),
(86, 'Pont en arc'),
(87, 'Pont à poutres'),
(88, 'Pont à haubans'),
(89, 'Pont à voûtes'),
(90, 'Pont suspendu'),
(91, 'Ancienne'),
(92, 'Classique'),
(93, 'Mediévale'),
(96, 'Influence Renaissance'),
(97, '19ème Siècle'),
(98, 'Moderne'),
(99, 'Panneau thermique'),
(100, 'Baignoire'),
(101, 'WC'),
(102, 'Epandage'),
(103, 'Fosse toutes eaux'),
(104, 'Arroseur'),
(105, 'Pompe de relevage'),
(106, 'Evier'),
(107, 'Descente de chéneau'),
(108, 'Douche'),
(109, 'Eau chaude'),
(110, 'Eau froide'),
(111, 'Evacuation'),
(112, 'Compteur eau'),
(113, 'Récupérateur eau'),
(114, 'Machine à laver'),
(115, 'Ballon eau'),
(116, 'VMC'),
(117, 'Poêle à bois'),
(118, 'Radiateur électrique'),
(119, 'Pompe à chaleur eau/eau'),
(120, 'Pompe à chaleur air/air'),
(121, 'Radiateur eau'),
(122, 'Puit canadien'),
(123, 'air frais'),
(124, 'air vicié'),
(125, 'Panneau photovoltaïque'),
(126, 'Luminaire'),
(127, 'Régulateur'),
(128, 'Compteur électrique'),
(129, 'Transformateur'),
(130, 'Ordinateur fixe'),
(131, 'Radio'),
(132, 'Lampe'),
(133, 'Four'),
(134, 'Prise de terre'),
(135, 'Tableau électrique'),
(136, 'Parabole'),
(137, 'Décodeur TNT'),
(138, 'Décodeur satellite'),
(139, 'Téléphone fixe'),
(140, 'Télécommande TV'),
(141, 'Centrale alarme'),
(142, 'Détecteur mouvement'),
(143, 'Ecran de contrôle'),
(144, 'Gyrophare'),
(145, 'Télécommande radio'),
(146, 'Caméra de surveillance'),
(147, 'Box Wifi'),
(148, 'Téléphone sans fil'),
(149, 'Ordinateur portable'),
(150, 'Antenne rateau'),
(151, 'Idée'),
(152, 'Analyse du besoin'),
(153, 'Etude de faisabilité'),
(154, 'Conception'),
(155, 'Prototype'),
(156, 'Homologation'),
(157, 'Industrialisation'),
(158, 'Commercialisation'),
(159, 'Destruction /Recyclage'),
(160, '216.18.174.254'),
(161, '192.168.3.10'),
(162, '192.168.3.254'),
(163, '255.255.255.0'),
(164, 'Energie mécanique'),
(165, 'Energie thermique'),
(166, 'Energie électrique'),
(167, 'Energie chimique'),
(168, 'Energie lumineuse'),
(169, 'Energie sonore'),
(170, 'Réservoir'),
(171, 'Durite'),
(172, 'Moteur thermique'),
(173, 'Pignon et Chaine');

-- --------------------------------------------------------

--
-- Table structure for table `Type`
--

CREATE TABLE `Type` (
  `No_Type` int(11) NOT NULL,
  `Name_Type` varchar(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Type`
--

INSERT INTO `Type` (`No_Type`, `Name_Type`) VALUES
(1, 'quizz'),
(2, 'lien');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Activite`
--
ALTER TABLE `Activite`
  ADD PRIMARY KEY (`No_Act`);

--
-- Indexes for table `Act_Attrib`
--
ALTER TABLE `Act_Attrib`
  ADD PRIMARY KEY (`No-Act_Attrib`);

--
-- Indexes for table `Attrib_Chap`
--
ALTER TABLE `Attrib_Chap`
  ADD PRIMARY KEY (`No_Attrib`);

--
-- Indexes for table `Attrib_Niv`
--
ALTER TABLE `Attrib_Niv`
  ADD PRIMARY KEY (`No_Niv_Attrib`);

--
-- Indexes for table `Chap`
--
ALTER TABLE `Chap`
  ADD PRIMARY KEY (`No_chap`);

--
-- Indexes for table `Etiquettes`
--
ALTER TABLE `Etiquettes`
  ADD PRIMARY KEY (`No_Etiqu`);

--
-- Indexes for table `Img`
--
ALTER TABLE `Img`
  ADD PRIMARY KEY (`No_Img`);

--
-- Indexes for table `Liens`
--
ALTER TABLE `Liens`
  ADD PRIMARY KEY (`No_Lien`);

--
-- Indexes for table `Listes`
--
ALTER TABLE `Listes`
  ADD PRIMARY KEY (`No_Liste`),
  ADD KEY `No_Liste` (`No_Liste`);

--
-- Indexes for table `Niveau`
--
ALTER TABLE `Niveau`
  ADD PRIMARY KEY (`No_Niv`);

--
-- Indexes for table `Reponses`
--
ALTER TABLE `Reponses`
  ADD PRIMARY KEY (`No_Rep`);

--
-- Indexes for table `Type`
--
ALTER TABLE `Type`
  ADD PRIMARY KEY (`No_Type`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Activite`
--
ALTER TABLE `Activite`
  MODIFY `No_Act` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT for table `Act_Attrib`
--
ALTER TABLE `Act_Attrib`
  MODIFY `No-Act_Attrib` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=184;

--
-- AUTO_INCREMENT for table `Attrib_Chap`
--
ALTER TABLE `Attrib_Chap`
  MODIFY `No_Attrib` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- AUTO_INCREMENT for table `Attrib_Niv`
--
ALTER TABLE `Attrib_Niv`
  MODIFY `No_Niv_Attrib` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `Chap`
--
ALTER TABLE `Chap`
  MODIFY `No_chap` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `Etiquettes`
--
ALTER TABLE `Etiquettes`
  MODIFY `No_Etiqu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=250;

--
-- AUTO_INCREMENT for table `Img`
--
ALTER TABLE `Img`
  MODIFY `No_Img` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `Liens`
--
ALTER TABLE `Liens`
  MODIFY `No_Lien` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `Listes`
--
ALTER TABLE `Listes`
  MODIFY `No_Liste` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=240;

--
-- AUTO_INCREMENT for table `Niveau`
--
ALTER TABLE `Niveau`
  MODIFY `No_Niv` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `Reponses`
--
ALTER TABLE `Reponses`
  MODIFY `No_Rep` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=174;

--
-- AUTO_INCREMENT for table `Type`
--
ALTER TABLE `Type`
  MODIFY `No_Type` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
