# Module de Rapports - QApp Frontend

## Vue d'ensemble

Le module de rapports fournit une interface complète pour visualiser et analyser les performances de la plateforme QApp. Il comprend deux types de rapports principaux :

1. **Rapports Administrateur** - Vue globale de toute la plateforme
2. **Rapports Entreprise** - Vue détaillée pour une entreprise spécifique

## Fonctionnalités

### Rapports Administrateur (`/admin/rapports`)

- **Statistiques globales** : Entreprises, utilisateurs, tickets, services
- **Performance des entreprises** : Classement par efficacité
- **Croissance mensuelle** : Évolution sur 6 mois
- **Répartition par catégorie** : Distribution des entreprises
- **Statistiques par pays** : Analyse géographique

### Rapports Entreprise (`/dashboard/rapports`)

- **Performance globale** : Vue d'ensemble de l'entreprise
- **Comparaison temporelle** : Évolution par rapport à la période précédente
- **Performance par service** : Analyse détaillée par service
- **Performance par employé** : Productivité individuelle
- **Flux d'affluence** : Analyse des pics d'activité par heure et jour

## Fonctionnalités d'Export

- **Export PDF** : Rapport formaté pour l'impression
- **Export Excel** : Données tabulaires pour analyse
- **Impression** : Version optimisée pour l'impression

## Structure des Fichiers

```
app/
├── routes/
│   ├── admin.rapports.tsx          # Page de rapports administrateur
│   └── dashboard.rapports.tsx      # Page de rapports entreprise
├── types/
│   └── rapports.ts                 # Types TypeScript pour les rapports
├── components/
│   ├── ExportOptions.tsx           # Composant d'options d'export
│   ├── Button.tsx                  # Composant bouton réutilisable
│   ├── FormField.tsx               # Composant champ de formulaire
│   └── StatusMessage.tsx           # Composant de message de statut
├── utils/
│   ├── api.ts                      # Fonctions d'appel API (mises à jour)
│   ├── rapports.ts                 # Utilitaires pour rapports temps réel
│   └── mockRapports.ts             # Données de test
└── styles/
    └── rapport-print.css           # Styles d'impression
```

## Utilisation des API

### Endpoints Backend

Les routes suivantes sont appelées par le frontend :

```typescript
// Rapport administrateur
GET /rapports/administrateur?date_debut=YYYY-MM-DD&date_fin=YYYY-MM-DD

// Rapport entreprise
GET /rapports/entreprise/{entreprise_id}?date_debut=YYYY-MM-DD&date_fin=YYYY-MM-DD

// Export entreprise
GET /rapports/entreprise/{entreprise_id}/export?date_debut=YYYY-MM-DD&date_fin=YYYY-MM-DD&format_export=json|csv
```

### Authentification

- **Rapports Admin** : Nécessite le rôle `ADMINISTRATEUR`
- **Rapports Entreprise** : Nécessite le rôle `ENTREPRISE_AGENT` avec accès à l'entreprise

## Composants Principaux

### StatistiquesGlobalesCard
Affiche les métriques clés sous forme de cartes avec icônes et couleurs.

### Graphiques
- **CroissanceMensuelleChart** : Graphique en barres pour la croissance
- **RepartitionCategoriesChart** : Graphique en secteurs pour les catégories
- **FluxAffluenteChart** : Graphiques de flux temporels

### Tableaux
- **TopEntreprisesTable** : Classement des meilleures entreprises
- **PerformanceServicesTable** : Performance détaillée par service
- **PerformanceEmployesTable** : Performance individuelle des employés

## Personnalisation des Couleurs

La palette de couleurs respecte l'identité visuelle de QApp :

```css
/* Couleurs principales */
--primary-dark: #00296b
--primary-medium: #003f88
--primary-light: #00509d
--accent-yellow: #fdc500
--accent-light-yellow: #ffd500
```

## Options d'Export

### PDF
Utilise des styles d'impression optimisés avec :
- Marges adaptées
- Couleurs noir et blanc
- Pagination automatique
- En-têtes et pieds de page

### Excel
Exporte les données tabulaires pour :
- Analyse approfondie
- Création de graphiques personnalisés
- Archivage des données

### Impression
CSS spécialisé pour :
- Masquer les éléments non nécessaires
- Optimiser la mise en page
- Éviter les coupures de contenu

## Temps Réel (Optionnel)

Le système supporte les mises à jour en temps réel via WebSocket :

```typescript
// Utilisation du hook WebSocket
const { connect, disconnect, requestUpdate } = useRapportWebSocket(
  entrepriseId,
  (data) => setRapport(data)
);
```

## Gestion des Erreurs

- Messages d'erreur contextuels
- Fallback en cas d'échec d'API
- États de chargement appropriés
- Validation des dates

## Tests avec Données Mock

Utilisez `mockRapports.ts` pour tester l'interface sans backend :

```typescript
import { mockRapportAdministrateur, mockRapportEntreprise } from "~/utils/mockRapports";
```

## Performance

- Pagination automatique des grandes listes
- Chargement progressif des graphiques
- Optimisation des re-rendus React
- Mise en cache des données fréquentes

## Accessibilité

- Support des lecteurs d'écran
- Navigation au clavier
- Contraste approprié pour l'impression
- Libellés descriptifs pour les graphiques

## Prochaines Étapes

1. **Intégration de bibliothèques de graphiques** (Chart.js, D3.js)
2. **Export PDF avancé** avec jsPDF
3. **Export Excel** avec SheetJS
4. **Filtres avancés** par période, catégorie, etc.
5. **Rapports programmés** et notifications
6. **Tableaux de bord interactifs**

## Support

Pour toute question ou problème lié aux rapports, consultez :
- La documentation de l'API backend
- Les types TypeScript dans `types/rapports.ts`
- Les exemples dans `utils/mockRapports.ts`
