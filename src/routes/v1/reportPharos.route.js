const express = require('express');
const multer = require('multer');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const reportPharosValidation = require('../../validations/reportPharos.validation');
const reportPharosController = require('../../controllers/reportPharos.controller');

// Configuration de multer pour l'upload d'image
const storage = multer.memoryStorage(); // Utiliser la mémoire pour stocker temporairement le fichier
const upload = multer({ storage });

const router = express.Router();

router
  .route('/')
  .post(
    auth('createReportPharos'),
    upload.single('image'), // Ajoute le middleware d'upload
    validate(reportPharosValidation.createReportPharos),
    reportPharosController.createReportPharos
  )
  .get(auth('getReportsPharos'), validate(reportPharosValidation.getReportsPharos), reportPharosController.getReportsPharos);

router
  .route('/:reportPharosId')
  .get(auth('getReportsPharos'), validate(reportPharosValidation.getReportPharos), reportPharosController.getReportPharos)
  .patch(
    auth('manageReportsPharos'),
    validate(reportPharosValidation.updateReportPharos),
    reportPharosController.updateReportPharos
  )
  .delete(
    auth('manageReportsPharos'),
    validate(reportPharosValidation.deleteReportPharos),
    reportPharosController.deleteReportPharos
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: ReportPharos
 *   description: Gestion et récupération des rapports Pharos
 */

/**
 * @swagger
 * /reports-pharos:
 *   post:
 *     summary: Créer un rapport Pharos
 *     description: Les utilisateurs authentifiés peuvent créer un rapport Pharos pour signaler une URL suspecte. Chaque utilisateur peut signaler une URL spécifique une seule fois.
 *     tags: [ReportPharos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true  # Changez à true si le corps de la requête doit être requis
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - cause
 *               - image
 *               - description  # Ajouté ici
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: URL du contenu signalé
 *               cause:
 *                 type: string
 *                 enum: [harassment, terrorism, phishing, fraud, illegal_content, other]
 *                 description: Cause du rapport
 *               description:
 *                 type: string
 *                 description: Description du rapport encodée en base64
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Fichier d'image joint au rapport
 *             example:
 *               url: https://example.com
 *               cause: phishing
 *               description: "VGVzdCBkZSBkZXNjcmlwdGlvbiBlbmNvZGVlIGVuIGJhc2U2NA=="
 *     responses:
 *       "201":
 *         description: Créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Signalement enregistré."
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *
 *   get:
 *     summary: Obtenir tous les rapports Pharos
 *     description: Récupérer une liste de tous les rapports Pharos. Seuls les administrateurs peuvent voir tous les rapports. Des filtres peuvent être appliqués par URL et par cause.
 *     tags: [ReportPharos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *           format: uri
 *         description: Filtrer par URL
 *       - in: query
 *         name: cause
 *         schema:
 *           type: string
 *         description: Filtrer par cause du rapport
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Option de tri, par exemple "createdAt:desc"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Nombre maximum de rapports
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 1
 *         description: Numéro de page
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ReportPharos'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /reports-pharos/{reportPharosId}:
 *   get:
 *     summary: Obtenir un rapport Pharos spécifique par ID
 *     description: Récupérer un rapport Pharos spécifique par son ID. Seuls les administrateurs peuvent voir n'importe quel rapport.
 *     tags: [ReportPharos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportPharosId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du rapport
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportPharos'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Mettre à jour un rapport Pharos
 *     description: Permet à un administrateur de mettre à jour le statut ou la cause d'un rapport Pharos.
 *     tags: [ReportPharos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportPharosId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du rapport
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cause:
 *                 type: string
 *                 enum: [harassment, terrorism, phishing, fraud, illegal_content, other]
 *                 description: Cause mise à jour du rapport
 *               status:
 *                 type: string
 *                 enum: [pending, reviewed, resolved, rejected]
 *                 description: Mise à jour du statut du rapport
 *             example:
 *               cause: fraud
 *               status: reviewed
 *     responses:
 *       "200":
 *         description: Mise à jour réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportPharos'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Supprimer un rapport Pharos
 *     description: Permet à un administrateur de supprimer un rapport Pharos.
 *     tags: [ReportPharos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportPharosId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du rapport
 *     responses:
 *       "204":
 *         description: Pas de contenu, rapport supprimé avec succès
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
