
import { Button } from "./Button";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { RapportAdministrateur } from "~/types/rapports";

interface ExportOptionsProps {
  onExportPDF: () => void;
  onExportExcel: () => void;
  onPrint: () => void;
  loading?: boolean;
}

export function ExportOptions({ 
  onExportPDF, 
  onExportExcel, 
  onPrint, 
  loading = false 
}: ExportOptionsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8 export-options no-print">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Exporter le Rapport
      </h3>
      <div className="flex flex-wrap gap-4">
        <Button
          onClick={onExportPDF}
          disabled={loading}
          variant="secondary"
          className="flex items-center space-x-2"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span>Exporter en PDF</span>
        </Button>

        <Button
          onClick={onExportExcel}
          disabled={loading}
          variant="secondary"
          className="flex items-center space-x-2"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Exporter en Excel</span>
        </Button>

        <Button
          onClick={onPrint}
          disabled={loading}
          variant="secondary"
          className="flex items-center space-x-2"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span>Imprimer</span>
        </Button>
      </div>
    </div>
  );
}

// Fonction pour exporter en PDF
export function exportToPDF(rapport: RapportAdministrateur, filename: string) {
  try {
    const doc = new jsPDF();

    // Configuration des couleurs comme tuples
    const primaryColor: [number, number, number] = [0, 41, 107]; // #00296b
    const secondaryColor: [number, number, number] = [51, 51, 51]; // #333
    const lightGray: [number, number, number] = [245, 245, 245]; // #f5f5f5

    // En-tête du document
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Rapport Administrateur', 105, 20, { align: 'center' });

    // Période du rapport
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const periode = `Période: ${new Date(rapport.periode_debut).toLocaleDateString('fr-FR')} - ${new Date(rapport.periode_fin).toLocaleDateString('fr-FR')}`;
    doc.text(periode, 105, 40, { align: 'center' });

    // Date de génération
    const dateGeneration = `Généré le: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`;
    doc.text(dateGeneration, 105, 47, { align: 'center' });

    let yPosition = 60;

    // Statistiques globales
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Statistiques Globales', 20, yPosition);
    yPosition += 10;

    const stats = rapport.statistiques_globales;
    const statistiques = [
      ['Métrique', 'Valeur'],
      ['Total Entreprises', stats.total_entreprises.toLocaleString()],
      ['Entreprises Actives', stats.entreprises_actives.toLocaleString()],
      ['Entreprises en Attente', stats.entreprises_en_attente.toLocaleString()],
      ['Total Utilisateurs', stats.total_utilisateurs.toLocaleString()],
      ['Total Tickets', stats.total_tickets.toLocaleString()],
      ['Total Services', stats.total_services.toLocaleString()],
    ];

    autoTable(doc, {
      head: [statistiques[0]],
      body: statistiques.slice(1),
      startY: yPosition,
      styles: { fontSize: 10 },
      headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: lightGray },
      margin: { left: 20, right: 20 },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    yPosition = (doc as any).lastAutoTable.finalY + 20;

    // Top Entreprises
    if (rapport.top_entreprises.length > 0) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('Top 10 Entreprises par Performance', 20, yPosition);
      yPosition += 10;

      const entreprisesData = [
        ['Entreprise', 'Catégorie', 'Tickets', 'Taux Résolution', 'Employés']
      ];

      rapport.top_entreprises.slice(0, 10).forEach(entreprise => {
        entreprisesData.push([
          entreprise.nom_entreprise,
          entreprise.categorie,
          entreprise.total_tickets.toString(),
          `${entreprise.taux_resolution.toFixed(1)}%`,
          entreprise.nombre_employes.toString()
        ]);
      });

      autoTable(doc, {
        head: [entreprisesData[0]],
        body: entreprisesData.slice(1),
        startY: yPosition,
        styles: { fontSize: 9 },
        headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: lightGray },
        margin: { left: 20, right: 20 },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      yPosition = (doc as any).lastAutoTable.finalY + 20;
    }

    // Nouvelle page pour les autres sections
    doc.addPage();
    yPosition = 20;

    // Répartition par catégorie
    if (rapport.repartition_categories.length > 0) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('Répartition par Catégorie', 20, yPosition);
      yPosition += 10;

      const categoriesData = [
        ['Catégorie', 'Nombre d\'entreprises', 'Pourcentage']
      ];

      rapport.repartition_categories.forEach(cat => {
        categoriesData.push([
          cat.categorie,
          cat.nombre_entreprises.toString(),
          `${cat.pourcentage.toFixed(1)}%`
        ]);
      });

      autoTable(doc, {
        head: [categoriesData[0]],
        body: categoriesData.slice(1),
        startY: yPosition,
        styles: { fontSize: 10 },
        headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: lightGray },
        margin: { left: 20, right: 20 },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      yPosition = (doc as any).lastAutoTable.finalY + 20;
    }

    // Croissance mensuelle
    if (rapport.croissance_mensuelle.length > 0) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('Croissance Mensuelle', 20, yPosition);
      yPosition += 10;

      const croissanceData = [
        ['Période', 'Nouvelles Entreprises', 'Nouveaux Utilisateurs', 'Nouveaux Tickets']
      ];

      rapport.croissance_mensuelle.forEach(periode => {
        croissanceData.push([
          periode.periode,
          periode.nouvelles_entreprises.toString(),
          periode.nouveaux_utilisateurs.toString(),
          periode.nouveaux_tickets.toString()
        ]);
      });

      autoTable(doc, {
        head: [croissanceData[0]],
        body: croissanceData.slice(1),
        startY: yPosition,
        styles: { fontSize: 10 },
        headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: lightGray },
        margin: { left: 20, right: 20 },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      yPosition = (doc as any).lastAutoTable.finalY + 20;
    }

    // Statistiques par pays
    if (rapport.statistiques_par_pays.length > 0) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('Statistiques par Pays', 20, yPosition);
      yPosition += 10;

      const paysData = [
        ['Pays', 'Entreprises', 'Utilisateurs', 'Tickets']
      ];

      rapport.statistiques_par_pays.forEach(pays => {
        paysData.push([
          pays.pays,
          pays.nombre_entreprises.toString(),
          pays.nombre_utilisateurs.toString(),
          pays.nombre_tickets.toString()
        ]);
      });

      autoTable(doc, {
        head: [paysData[0]],
        body: paysData.slice(1),
        startY: yPosition,
        styles: { fontSize: 10 },
        headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: lightGray },
        margin: { left: 20, right: 20 },
      });
    }

    // Pied de page sur toutes les pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} sur ${pageCount}`, 105, 290, { align: 'center' });
      doc.text('Généré par QApp - Système de gestion de files d\'attente', 105, 295, { align: 'center' });
    }

    // Télécharger le PDF
    doc.save(filename);

  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
  }
}

// Fonction pour exporter en Excel
export function exportToExcel(rapport: RapportAdministrateur, filename: string) {
  try {
    const workbook = XLSX.utils.book_new();

    // Feuille 1: Statistiques globales
    const statsData = [
      ['Métrique', 'Valeur'],
      ['Période', `${rapport.periode_debut} - ${rapport.periode_fin}`],
      ['Total Entreprises', rapport.statistiques_globales.total_entreprises],
      ['Entreprises Actives', rapport.statistiques_globales.entreprises_actives],
      ['Entreprises en Attente', rapport.statistiques_globales.entreprises_en_attente],
      ['Total Utilisateurs', rapport.statistiques_globales.total_utilisateurs],
      ['Total Tickets', rapport.statistiques_globales.total_tickets],
      ['Total Services', rapport.statistiques_globales.total_services],
    ];

    const statsSheet = XLSX.utils.aoa_to_sheet(statsData);
    XLSX.utils.book_append_sheet(workbook, statsSheet, 'Statistiques Globales');

    // Feuille 2: Top entreprises
    if (rapport.top_entreprises.length > 0) {
      const entreprisesData = [
        ['Entreprise', 'Catégorie', 'Total Tickets', 'Tickets Traités', 'Taux Résolution (%)', 'Temps Moyen', 'Employés', 'Agences']
      ];

      rapport.top_entreprises.forEach(entreprise => {
        entreprisesData.push([
          entreprise.nom_entreprise,
          entreprise.categorie,
          entreprise.total_tickets.toString(),
          entreprise.tickets_traites.toString(),
          entreprise.taux_resolution.toString(),
          entreprise.temps_moyen_formate,
          entreprise.nombre_employes.toString(),
          entreprise.nombre_agences.toString()
        ]);
      });

      const entreprisesSheet = XLSX.utils.aoa_to_sheet(entreprisesData);
      XLSX.utils.book_append_sheet(workbook, entreprisesSheet, 'Top Entreprises');
    }

    // Feuille 3: Répartition par catégorie
    if (rapport.repartition_categories.length > 0) {
      const categoriesData = [
        ['Catégorie', 'Nombre d\'entreprises', 'Pourcentage (%)']
      ];

      rapport.repartition_categories.forEach(cat => {
        categoriesData.push([
          cat.categorie,
          cat.nombre_entreprises.toString(),
          cat.pourcentage.toString()
        ]);
      });

      const categoriesSheet = XLSX.utils.aoa_to_sheet(categoriesData);
      XLSX.utils.book_append_sheet(workbook, categoriesSheet, 'Répartition Catégories');
    }

    // Feuille 4: Croissance mensuelle
    if (rapport.croissance_mensuelle.length > 0) {
      const croissanceData = [
        ['Période', 'Nouvelles Entreprises', 'Nouveaux Utilisateurs', 'Nouveaux Tickets']
      ];

      rapport.croissance_mensuelle.forEach(periode => {
        croissanceData.push([
          periode.periode,
          periode.nouvelles_entreprises.toString(),
          periode.nouveaux_utilisateurs.toString(),
          periode.nouveaux_tickets.toString()
        ]);
      });

      const croissanceSheet = XLSX.utils.aoa_to_sheet(croissanceData);
      XLSX.utils.book_append_sheet(workbook, croissanceSheet, 'Croissance Mensuelle');
    }

    // Feuille 5: Statistiques par pays
    if (rapport.statistiques_par_pays.length > 0) {
      const paysData = [
        ['Pays', 'Nombre d\'entreprises', 'Nombre d\'utilisateurs', 'Nombre de tickets']
      ];

      rapport.statistiques_par_pays.forEach(pays => {
        paysData.push([
          pays.pays,
          pays.nombre_entreprises.toString(),
          pays.nombre_utilisateurs.toString(),
          pays.nombre_tickets.toString()
        ]);
      });

      const paysSheet = XLSX.utils.aoa_to_sheet(paysData);
      XLSX.utils.book_append_sheet(workbook, paysSheet, 'Statistiques par Pays');
    }

    // Télécharger le fichier Excel
    XLSX.writeFile(workbook, filename);

  } catch (error) {
    console.error('Erreur lors de la génération du fichier Excel:', error);
    alert('Erreur lors de la génération du fichier Excel. Veuillez réessayer.');
  }
}

export function printReport() {
  window.print();
}
