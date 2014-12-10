The idle Shoot'em Up
====================

Side scroller classique, le joueur controle un vaisseau spatial et des vagues successives d'ennemis arrivent par la droite.

Le pilote peut récolter les débris des ennemis tués. Avec les débris il peut construire des systèmes ou upgrader ses systèmes existants.

# Vagues d'ennemis

Chaque type d'ennemi a une population max **P**, un niveau minimum **n** et un niveau maximum **N**. Pour la vague **V**, et un type d'ennemi donné éligible, on va générer aléatoirement un score **S** entre 0 et 1.

````
Si n < V < N                     // Test d'éligibilité
    Si S < (V - n) / (N - n)
        Spawn !
````

Si on a un spawn de ce type d'ennemi, on calcule la population comme ça (distribution normale) :

````
               1       (-S² / 2)
  1 + ( P * ( ---  *  e          ) )
              √2π
````

Une fois qu'on connait la population à spawner pour tous les types d'ennemis éligibles, on met les méchants dans un tableau, on leur ajoute des delays aléatoires, on mélange le tout et BOUM!

Chaque ennemi a également des **HP** et va laisser entre **n** et **N** (distribution normale) débris.

En autopilot, le vaisseau a une stratégie parfaite mais il ne va pas très vite. L'autopilot grinde les niveaux mais ne tue pas les bosses.
Il gagne des vies toutes les # secondes.

# Systèmes

Le joueur commence avec seulement les armes

## Canon

Le canon commence à 



- Aimant
- Autopilot
- 
