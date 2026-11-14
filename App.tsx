import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

type Categorie = 'Atelier' | 'Conférence' | 'Rencontre';
type Statut = 'Complet' | 'Presque complet' | 'Ouvert';
type Mode = 'tous' | 'ateliers';

type Evenement = {
  id: string;
  titre: string;
  categorie: Categorie;
  capacite: number;
  inscrits: number;
};

const evenements: Evenement[] = [
  { id: 'E01', titre: 'Atelier React', categorie: 'Atelier', capacite: 25, inscrits: 25 },
  { id: 'E02', titre: 'Conférence IA', categorie: 'Conférence', capacite: 70, inscrits: 52 },
  { id: 'E03', titre: 'Sécurité mobile', categorie: 'Atelier', capacite: 20, inscrits: 17 },
  { id: 'E04', titre: 'Design UI', categorie: 'Atelier', capacite: 18, inscrits: 9 },
  { id: 'E05', titre: 'Forum projets', categorie: 'Rencontre', capacite: 50, inscrits: 49 },
  { id: 'E06', titre: 'Découverte Git', categorie: 'Atelier', capacite: 24, inscrits: 24 },
];

const modeChoisi: Mode = 'tous';

function placesRestantes(e: Evenement): number {
  return Math.max(0, e.capacite - e.inscrits);
}

function statutEvenement(e: Evenement): Statut {
  const restantes = placesRestantes(e);
  if (restantes === 0) return 'Complet';
  if (restantes <= 3) return 'Presque complet';
  return 'Ouvert';
}

function selectionnerEvenements(liste: Evenement[], mode: Mode): Evenement[] {
  if (mode === 'ateliers') {
    return liste.filter(
      (e) => e.categorie === 'Atelier' && placesRestantes(e) > 0
    );
  }
  return liste;
}

function calculerStatistiques(liste: Evenement[]) {
  return {
    total: liste.length,
    complets: liste.filter((e) => placesRestantes(e) === 0).length,
    disponibles: liste.filter((e) => placesRestantes(e) > 0).length,
    placesLibres: liste.reduce((somme, e) => somme + placesRestantes(e), 0),
  };
}

type BadgeEtatProps = { statut: Statut };

function BadgeEtat({ statut }: BadgeEtatProps) {
  const styleEtat =
    statut === 'Complet'
      ? styles.badgeComplet
      : statut === 'Presque complet'
        ? styles.badgePresque
        : styles.badgeOuvert;

  return (
    <View style={[styles.badge, styleEtat]}>
      <Text style={styles.badgeTexte}>{statut}</Text>
    </View>
  );
}

type CarteEvenementProps = { evenement: Evenement };

function CarteEvenement({ evenement }: CarteEvenementProps) {
  const restantes = placesRestantes(evenement);
  const statut = statutEvenement(evenement);

  return (
    <View style={styles.carte}>
      <Text style={styles.carteTitre}>{evenement.titre}</Text>
      <Text style={styles.carteCategorie}>{evenement.categorie}</Text>
      <View style={styles.carteBas}>
        <Text style={styles.cartePlaces}>
          {restantes} place{restantes > 1 ? 's' : ''} restante{restantes > 1 ? 's' : ''}
        </Text>
        <BadgeEtat statut={statut} />
      </View>
    </View>
  );
}

type BlocStatistiqueProps = {
  valeur: number;
  libelle: string;
  etroit: boolean;
};

function BlocStatistique({ valeur, libelle, etroit }: BlocStatistiqueProps) {
  return (
    <View style={[styles.statistique, etroit && styles.statistiqueEtroite]}>
      <Text style={styles.statistiqueValeur}>{valeur}</Text>
      <Text style={styles.statistiqueLibelle}>{libelle}</Text>
    </View>
  );
}

export default function App() {
  const { width } = useWindowDimensions();
  const etroit = width < 360;
  const statistiques = calculerStatistiques(evenements);
  const listeAffichee = selectionnerEvenements(evenements, modeChoisi);

  return (
    <View style={styles.ecran}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F7FD" />
      <FlatList
        data={listeAffichee}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CarteEvenement evenement={item} />}
        contentContainerStyle={styles.contenu}
        ItemSeparatorComponent={() => <View style={styles.separateur} />}
        ListHeaderComponent={
          <View>
            <Text style={styles.titre}>CampusAgenda</Text>
            <Text style={styles.sousTitre}>Événements du campus</Text>
            <View style={styles.statistiques}>
              <BlocStatistique valeur={statistiques.total} libelle="Événements" etroit={etroit} />
              <BlocStatistique valeur={statistiques.complets} libelle="Complets" etroit={etroit} />
              <BlocStatistique valeur={statistiques.disponibles} libelle="Avec places" etroit={etroit} />
              <BlocStatistique valeur={statistiques.placesLibres} libelle="Places libres" etroit={etroit} />
            </View>
            <Text style={styles.titreListe}>
              {modeChoisi === 'tous' ? 'Tous les événements' : 'Ateliers disponibles'}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.messageVide}>Aucun événement à afficher.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  ecran: { flex: 1, backgroundColor: '#F2F7FD', paddingTop: 28 },
  contenu: { paddingHorizontal: 16, paddingBottom: 28, flexGrow: 1 },
  titre: { color: '#003796', fontSize: 27, fontWeight: 'bold', textAlign: 'center' },
  sousTitre: { color: '#4C5360', fontSize: 15, textAlign: 'center', marginBottom: 20 },
  statistiques: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statistique: {
    width: '48%', padding: 12, backgroundColor: '#E8F0FF', borderRadius: 12,
    alignItems: 'center', marginBottom: 10,
  },
  statistiqueEtroite: { width: '100%' },
  statistiqueValeur: { fontSize: 22, fontWeight: 'bold', color: '#00235C' },
  statistiqueLibelle: { fontSize: 13, color: '#4C5360', textAlign: 'center' },
  titreListe: { fontSize: 18, fontWeight: 'bold', color: '#00235C', marginVertical: 12 },
  carte: {
    backgroundColor: '#FFFFFF', padding: 15, borderRadius: 14,
    borderWidth: 1, borderColor: '#D0DFF1',
  },
  carteTitre: { fontSize: 17, fontWeight: 'bold', color: '#00235C' },
  carteCategorie: { fontSize: 13, color: '#4C5360', marginTop: 4, marginBottom: 10 },
  carteBas: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' },
  cartePlaces: { color: '#003796', fontSize: 14, marginRight: 8, marginBottom: 6 },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginBottom: 6 },
  badgeComplet: { backgroundColor: '#FCE5E5' },
  badgePresque: { backgroundColor: '#FFF0D8' },
  badgeOuvert: { backgroundColor: '#DCF4E8' },
  badgeTexte: { fontSize: 12, fontWeight: 'bold', color: '#00235C' },
  separateur: { height: 12 },
  messageVide: { textAlign: 'center', padding: 24, color: '#4C5360', fontSize: 15 },
});
