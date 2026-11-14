import { FlatList, View, Text, StyleSheet } from "react-native";

type Evenement = {
  id: string;
  titre: string;
  categorie: string;
  capacite: number;
  inscrits: number;
};

const evenements: Evenement[] = [
  { id: "E01", titre: "Atelier React", categorie: "Atelier", capacite: 25, inscrits: 25 },
  { id: "E02", titre: "Conférence IA", categorie: "Conférence", capacite: 70, inscrits: 52 },
  { id: "E03", titre: "Sécurité mobile", categorie: "Atelier", capacite: 20, inscrits: 17 },
  { id: "E04", titre: "Design UI", categorie: "Atelier", capacite: 18, inscrits: 9 },
  { id: "E05", titre: "Forum projets", categorie: "Rencontre", capacite: 50, inscrits: 49 },
  { id: "E06", titre: "Découverte Git", categorie: "Atelier", capacite: 24, inscrits: 24 },
];


function placesRestantes(e: Evenement): number {
  return Math.max(0, e.capacite - e.inscrits);
}

function statutEvenement(e: Evenement): string {
  const r = placesRestantes(e);
  if (r === 0) return "Complet";
  if (r <= 3) return "Presque complet";
  return "Ouvert";
}


type BadgeProps = { statut: string };

function BadgeEtat({ statut }: BadgeProps) {
  let fond = "#D6F5E7"; 
  if (statut === "Complet") fond = "#FFE5E5"; 
  else if (statut === "Presque complet") fond = "#FFE9CC"; 
  return (
    <View style={[styles.badge, { backgroundColor: fond }]}>
      <Text style={styles.texteBadge}>{statut}</Text>
    </View>
  );
}

type CarteProps = { evenement: Evenement };

function CarteEvenement({ evenement }: CarteProps) {
  const { titre, categorie } = evenement;
  return (
    <View style={styles.carte}>
      <View style={styles.enteteCarte}>
        <Text style={styles.titreCarte}>{titre}</Text>
        <BadgeEtat statut={statutEvenement(evenement)} />
      </View>
      <Text style={styles.information}>{categorie}</Text>
      <Text style={styles.information}>
        {placesRestantes(evenement)} places restantes
      </Text>
    </View>
  );
}

type BlocProps = { libelle: string; valeur: number };

function BlocStatistique({ libelle, valeur }: BlocProps) {
  return (
    <View style={styles.bloc}>
      <Text style={styles.valeur}>{valeur}</Text>
      <Text style={styles.libelle}>{libelle}</Text>
    </View>
  );
}


export default function App() {

  const mode: string = "tous";

  const total = evenements.length;
  const complets = evenements.filter((e) => placesRestantes(e) === 0).length;
  const avecPlaces = evenements.filter((e) => placesRestantes(e) > 0).length;
  const totalPlaces = evenements.reduce((somme, e) => somme + placesRestantes(e), 0);

  const ateliersDispo = evenements.filter(
    (e) => e.categorie === "Atelier" && placesRestantes(e) > 0
  );
  const liste = mode === "tous" ? evenements : ateliersDispo;

  return (
    <View style={styles.page}>
      <Text style={styles.titre}>CampusAgenda</Text>
      <Text style={styles.sousTitre}>Événements du campus</Text>

      <View style={styles.rangee}>
        <BlocStatistique libelle="Événements" valeur={total} />
        <BlocStatistique libelle="Complets" valeur={complets} />
      </View>
      <View style={styles.rangee}>
        <BlocStatistique libelle="Avec places" valeur={avecPlaces} />
        <BlocStatistique libelle="Places restantes" valeur={totalPlaces} />
      </View>

      <Text style={styles.mode}>
        {mode === "tous" ? "Tous les événements" : "Ateliers disponibles"}
      </Text>

      {liste.length === 0 ? (
        <Text style={styles.vide}>Aucun événement à afficher.</Text>
      ) : (
        <FlatList
          data={liste}
          keyExtractor={(e) => e.id}
          renderItem={({ item }) => <CarteEvenement evenement={item} />}
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  page: { flex: 1, paddingTop: 56, paddingHorizontal: 18, backgroundColor: "#F2F7FD" },
  titre: { fontSize: 27, fontWeight: "bold", color: "#00235C" },
  sousTitre: { color: "#4C5360", marginTop: 4, marginBottom: 14 },
  rangee: { flexDirection: "row", marginBottom: 10 },
  bloc: {
    flex: 1,
    padding: 12,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: "#DCEBFF",
  },
  valeur: { fontSize: 22, fontWeight: "bold", color: "#00235C" },
  libelle: { color: "#00235C" },
  mode: { fontSize: 18, fontWeight: "600", color: "#00235C", marginTop: 6, marginBottom: 10 },
  carte: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D8E6F8",
  },
  enteteCarte: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  titreCarte: { fontSize: 17, fontWeight: "bold", color: "#00235C", flexShrink: 1 },
  information: { color: "#3D4A5C", marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, marginLeft: 8 },
  texteBadge: { fontSize: 12, fontWeight: "bold", color: "#00235C" },
  vide: { textAlign: "center", color: "#4C5360", marginTop: 20 },
});
