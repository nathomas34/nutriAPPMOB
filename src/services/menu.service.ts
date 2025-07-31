import { Injectable } from '@angular/core';
import { MenuItem } from '../models/user.model';
import { MenuCacheService } from './menu-cache.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor(private cacheService: MenuCacheService) {
    // Initialiser le cache avec les menus
    this.cacheService.cacheMenus(this.menus);
  }

  private menus: MenuItem[] = [
    // MENUS PERTE DE POIDS - PETIT DÉJEUNER
    {
      id: '1',
      name: 'Bowl protéiné aux baies',
      description: 'Yaourt grec, myrtilles, graines de chia et amandes',
      category: 'breakfast',
      goalType: 'weight-loss',
      calories: 280,
      protein: 20,
      carbs: 25,
      fat: 12,
      fiber: 8,
      ingredients: ['200g yaourt grec 0%', '100g myrtilles', '1 cuillère chia', '15g amandes effilées', '1 cuillère miel'],
      instructions: [
        'Dans un bol, mélanger le yaourt grec avec les graines de chia',
        'Laisser reposer 5 minutes pour que les graines gonflent',
        'Ajouter les myrtilles fraîches ou surgelées',
        'Garnir d\'amandes effilées et d\'un filet de miel',
        'Servir immédiatement ou réfrigérer jusqu\'à consommation'
      ],
      prepTime: 5,
      difficulty: 'easy',
      tags: ['protéiné', 'antioxydants', 'fibres'],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      tips: [
        'Utilisez du yaourt grec 0% pour réduire les calories',
        'Les graines de chia peuvent être remplacées par des graines de lin',
        'Ajoutez une pincée de cannelle pour plus de saveur'
      ]
    },
    {
      id: '2',
      name: 'Omelette aux légumes',
      description: 'Omelette aux épinards, tomates et champignons',
      category: 'breakfast',
      goalType: 'weight-loss',
      calories: 220,
      protein: 18,
      carbs: 8,
      fat: 14,
      fiber: 4,
      ingredients: ['2 œufs', '50g épinards frais', '1 tomate', '50g champignons', '1 cuillère huile olive'],
      instructions: [
        'Laver et couper les épinards, tomate et champignons',
        'Chauffer l\'huile d\'olive dans une poêle antiadhésive',
        'Faire revenir les champignons 2-3 minutes',
        'Ajouter les épinards et tomate, cuire 2 minutes',
        'Battre les œufs avec sel et poivre',
        'Verser les œufs sur les légumes',
        'Cuire 3-4 minutes en soulevant les bords',
        'Plier l\'omelette en deux et servir chaud'
      ],
      prepTime: 10,
      difficulty: 'easy',
      tags: ['protéines', 'légumes', 'faible en glucides'],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      tips: [
        'Ne pas trop cuire pour garder l\'omelette moelleuse',
        'Ajoutez du fromage râpé pour plus de saveur',
        'Utilisez une poêle de 20cm pour une épaisseur parfaite'
      ]
    },
    {
      id: '3',
      name: 'Smoothie vert détox',
      description: 'Épinards, pomme verte, concombre et protéine végétale',
      category: 'breakfast',
      goalType: 'weight-loss',
      calories: 190,
      protein: 22,
      carbs: 18,
      fat: 3,
      fiber: 6,
      ingredients: ['30g protéine végétale vanille', '100g épinards', '1 pomme verte', '100g concombre', '200ml eau de coco'],
      instructions: [
        'Laver soigneusement les épinards et le concombre',
        'Éplucher et couper la pomme en quartiers',
        'Mettre tous les ingrédients dans un blender puissant',
        'Mixer 60-90 secondes jusqu\'à obtenir une texture lisse',
        'Ajouter de la glace pilée si désiré',
        'Goûter et ajuster avec un peu de miel si nécessaire',
        'Servir immédiatement dans un grand verre'
      ],
      prepTime: 5,
      difficulty: 'easy',
      tags: ['détox', 'vitamines', 'hydratant'],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      tips: [
        'Utilisez des épinards jeunes pour un goût plus doux',
        'Ajoutez du gingembre frais pour un effet détox renforcé',
        'Consommez dans les 30 minutes pour préserver les vitamines'
      ]
    },
    
    // MENUS PERTE DE POIDS - DÉJEUNER
    {
      id: '4',
      name: 'Salade de quinoa au saumon',
      description: 'Quinoa, saumon grillé, avocat et légumes croquants',
      category: 'lunch',
      goalType: 'weight-loss',
      calories: 420,
      protein: 32,
      carbs: 35,
      fat: 18,
      fiber: 8,
      ingredients: ['80g quinoa cuit', '120g saumon grillé', '1/2 avocat', '100g concombre', '50g radis', 'Vinaigrette citron'],
      instructions: [
        'Rincer le quinoa et le cuire dans 2 volumes d\'eau salée pendant 15 minutes',
        'Égoutter et laisser refroidir le quinoa',
        'Assaisonner le saumon avec sel, poivre et herbes de Provence',
        'Griller le saumon 4-5 minutes de chaque côté',
        'Couper l\'avocat en dés et l\'arroser de citron',
        'Couper le concombre et les radis en rondelles fines',
        'Préparer la vinaigrette avec citron, huile d\'olive, moutarde',
        'Assembler tous les ingrédients dans un bol',
        'Assaisonner avec la vinaigrette et servir frais'
      ],
      prepTime: 25,
      difficulty: 'medium',
      tags: ['oméga-3', 'complet', 'antioxydants'],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      tips: [
        'Choisissez un saumon frais pour une meilleure qualité',
        'Le quinoa peut être cuit à l\'avance et conservé au frigo',
        'Ajoutez des graines de tournesol pour plus de croquant'
      ]
    },
    {
      id: '5',
      name: 'Wrap de dinde aux légumes',
      description: 'Tortilla complète, dinde, crudités et houmous',
      category: 'lunch',
      goalType: 'weight-loss',
      calories: 380,
      protein: 28,
      carbs: 32,
      fat: 15,
      fiber: 6,
      ingredients: ['1 tortilla complète', '100g dinde tranchée', '2 cuillères houmous', '50g salade', '1/2 tomate', '1/4 concombre'],
      instructions: [
        'Réchauffer légèrement la tortilla pour la rendre plus souple',
        'Étaler uniformément le houmous sur toute la surface',
        'Disposer les feuilles de salade en laissant les bords libres',
        'Ajouter la dinde tranchée au centre',
        'Couper la tomate et le concombre en lamelles fines',
        'Disposer les légumes sur la dinde',
        'Assaisonner avec sel, poivre et herbes fraîches',
        'Rouler fermement en repliant les bords',
        'Couper en deux en diagonale et servir'
      ],
      prepTime: 8,
      difficulty: 'easy',
      tags: ['portable', 'fibres', 'protéines maigres'],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      tips: [
        'Utilisez du papier aluminium pour maintenir la forme',
        'Préparez plusieurs wraps à l\'avance pour la semaine',
        'Variez les légumes selon les saisons'
      ]
    },
    
    // MENUS PRISE DE MASSE - PETIT DÉJEUNER
    {
      id: '6',
      name: 'Pancakes protéinés aux bananes',
      description: 'Pancakes riches en protéines avec beurre d\'amande',
      category: 'breakfast',
      goalType: 'weight-gain',
      calories: 520,
      protein: 28,
      carbs: 55,
      fat: 22,
      fiber: 6,
      ingredients: ['40g protéine whey vanille', '80g flocons d\'avoine', '2 bananes', '2 œufs', '2 cuillères beurre amande'],
      instructions: ['Mixer avoine, protéine, banane et œufs', 'Cuire les pancakes à la poêle', 'Servir avec beurre d\'amande'],
      prepTime: 15,
      difficulty: 'medium',
      tags: ['haute calorie', 'protéines', 'énergétique']
    },
    {
      id: '7',
      name: 'Bowl d\'avoine enrichi',
      description: 'Avoine, fruits secs, noix et graines pour l\'énergie',
      category: 'breakfast',
      goalType: 'weight-gain',
      calories: 480,
      protein: 18,
      carbs: 65,
      fat: 18,
      fiber: 12,
      ingredients: ['80g flocons d\'avoine', '300ml lait entier', '30g mélange fruits secs', '20g noix', '1 cuillère graines tournesol'],
      instructions: ['Cuire l\'avoine dans le lait', 'Ajouter fruits secs pendant la cuisson', 'Garnir de noix et graines'],
      prepTime: 10,
      difficulty: 'easy',
      tags: ['fibres', 'énergie durable', 'vitamines']
    },
    
    // MENUS MAINTENANCE - PETIT DÉJEUNER
    {
      id: '8',
      name: 'Toast avocat-œuf',
      description: 'Pain complet, avocat écrasé et œuf poché',
      category: 'breakfast',
      goalType: 'maintenance',
      calories: 350,
      protein: 16,
      carbs: 25,
      fat: 22,
      fiber: 8,
      ingredients: ['2 tranches pain complet', '1 avocat mûr', '1 œuf', 'Sel, poivre, citron'],
      instructions: ['Griller le pain', 'Écraser l\'avocat avec citron', 'Pocher l\'œuf', 'Assembler et assaisonner'],
      prepTime: 12,
      difficulty: 'medium',
      tags: ['équilibré', 'graisses saines', 'rassasiant']
    },
    
    // PLUS DE MENUS POUR ATTEINDRE 25+ PAR OBJECTIF
    {
      id: '9',
      name: 'Salade de thon méditerranéenne',
      description: 'Thon, olives, tomates cerises, feta et quinoa',
      category: 'lunch',
      goalType: 'weight-loss',
      calories: 390,
      protein: 30,
      carbs: 28,
      fat: 16,
      fiber: 6,
      ingredients: ['150g thon au naturel', '60g quinoa', '100g tomates cerises', '30g feta', '10 olives', 'Basilic frais'],
      instructions: ['Cuire le quinoa', 'Couper les tomates', 'Mélanger tous les ingrédients', 'Assaisonner avec herbes'],
      prepTime: 20,
      difficulty: 'easy',
      tags: ['méditerranéen', 'oméga-3', 'antioxydants']
    },
    {
      id: '10',
      name: 'Curry de lentilles aux épinards',
      description: 'Lentilles rouges, épinards, lait de coco et épices',
      category: 'dinner',
      goalType: 'weight-loss',
      calories: 320,
      protein: 18,
      carbs: 42,
      fat: 8,
      fiber: 12,
      ingredients: ['150g lentilles rouges', '200g épinards', '100ml lait de coco', 'Curcuma, cumin, gingembre'],
      instructions: ['Cuire les lentilles avec épices', 'Ajouter épinards et lait de coco', 'Mijoter 15 minutes'],
      prepTime: 30,
      difficulty: 'medium',
      tags: ['végétarien', 'anti-inflammatoire', 'fibres']
    },
    
    // Continuation des menus...
    {
      id: '11',
      name: 'Risotto protéiné aux champignons',
      description: 'Riz complet façon risotto avec champignons et parmesan',
      category: 'dinner',
      goalType: 'weight-gain',
      calories: 580,
      protein: 22,
      carbs: 68,
      fat: 24,
      fiber: 4,
      ingredients: ['120g riz complet', '200g champignons variés', '50g parmesan', '500ml bouillon', '2 cuillères huile olive'],
      instructions: ['Faire revenir champignons', 'Cuire le riz en ajoutant bouillon progressivement', 'Incorporer parmesan'],
      prepTime: 35,
      difficulty: 'hard',
      tags: ['réconfortant', 'riche', 'umami']
    },
    {
      id: '12',
      name: 'Saumon teriyaki aux légumes',
      description: 'Saumon grillé, sauce teriyaki maison et légumes sautés',
      category: 'dinner',
      goalType: 'maintenance',
      calories: 420,
      protein: 35,
      carbs: 18,
      fat: 22,
      fiber: 4,
      ingredients: ['150g filet de saumon', '150g brocolis', '100g courgettes', 'Sauce soja, miel, gingembre'],
      instructions: ['Mariner le saumon', 'Griller le poisson', 'Sauter les légumes', 'Napper de sauce'],
      prepTime: 25,
      difficulty: 'medium',
      tags: ['asiatique', 'oméga-3', 'coloré']
    },
    {
      id: '13',
      name: 'Energy balls aux dattes',
      description: 'Boules énergétiques dattes, amandes et cacao',
      category: 'snack',
      goalType: 'weight-gain',
      calories: 180,
      protein: 6,
      carbs: 22,
      fat: 8,
      fiber: 4,
      ingredients: ['100g dattes Medjool', '50g amandes', '2 cuillères cacao', '1 cuillère huile coco'],
      instructions: ['Mixer dattes et amandes', 'Ajouter cacao et huile', 'Former des boules', 'Réfrigérer 30 min'],
      prepTime: 15,
      difficulty: 'easy',
      tags: ['énergétique', 'naturel', 'portable']
    },
    {
      id: '14',
      name: 'Soupe miso aux algues',
      description: 'Soupe japonaise légère avec tofu soyeux',
      category: 'snack',
      goalType: 'weight-loss',
      calories: 85,
      protein: 8,
      carbs: 6,
      fat: 3,
      fiber: 2,
      ingredients: ['2 cuillères pâte miso', '100g tofu soyeux', 'Algues wakame', 'Ciboule'],
      instructions: ['Dissoudre le miso dans eau chaude', 'Ajouter tofu et algues', 'Garnir de ciboule'],
      prepTime: 10,
      difficulty: 'easy',
      tags: ['détox', 'japonais', 'probiotiques']
    }
  ];

  getMenusByGoal(goalType: string): MenuItem[] {
    // Utiliser le cache pour les performances
    const cachedMenus = this.cacheService.getCachedMenus();
    if (cachedMenus.length > 0) {
      return cachedMenus.filter(menu => menu.goalType === goalType);
    }
    return this.menus.filter(menu => menu.goalType === goalType);
  }

  getMenusByCategory(category: string): MenuItem[] {
    const cachedMenus = this.cacheService.getCachedMenus();
    if (cachedMenus.length > 0) {
      return cachedMenus.filter(menu => menu.category === category);
    }
    return this.menus.filter(menu => menu.category === category);
  }

  getMenusByGoalAndCategory(goalType: string, category: string): MenuItem[] {
    return this.menus.filter(menu => 
      menu.goalType === goalType && menu.category === category
    );
  }

  getRandomMenus(goalType: string, count: number = 5): MenuItem[] {
    const filteredMenus = this.getMenusByGoal(goalType);
    const shuffled = [...filteredMenus].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  generateWeeklyMealPlan(goalType: string, dailyCalories: number) {
    // Vérifier le cache d'abord
    const cachedPlan = this.cacheService.getCachedWeeklyPlan(goalType);
    if (cachedPlan) {
      return cachedPlan;
    }

    const weekPlan = [];
    
    for (let day = 0; day < 7; day++) {
      const breakfast = this.getRandomMenus(goalType, 1).filter(m => m.category === 'breakfast')[0] ||
                      this.getMenusByGoalAndCategory(goalType, 'breakfast')[0];
      const lunch = this.getRandomMenus(goalType, 1).filter(m => m.category === 'lunch')[0] ||
                   this.getMenusByGoalAndCategory(goalType, 'lunch')[0];  
      const dinner = this.getRandomMenus(goalType, 1).filter(m => m.category === 'dinner')[0] ||
                    this.getMenusByGoalAndCategory(goalType, 'dinner')[0];
      const snack = this.getRandomMenus(goalType, 1).filter(m => m.category === 'snack')[0] ||
                   this.getMenusByGoalAndCategory(goalType, 'snack')[0];

      const dayMeals = [breakfast, lunch, dinner, snack].filter(Boolean);
      const totalCalories = dayMeals.reduce((sum, meal) => sum + meal.calories, 0);

      weekPlan.push({
        day: day + 1,
        meals: dayMeals,
        totalCalories,
        calorieTarget: dailyCalories,
        variance: Math.abs(totalCalories - dailyCalories)
      });
    }
    
    // Mettre en cache le plan généré
    this.cacheService.cacheWeeklyPlan(goalType, weekPlan);
    return weekPlan;
  }

  searchMenus(query: string): MenuItem[] {
    // Ajouter à l'historique de recherche
    this.cacheService.addToSearchHistory(query);
    
    const lowercaseQuery = query.toLowerCase();
    const menusToSearch = this.cacheService.getCachedMenus().length > 0 
      ? this.cacheService.getCachedMenus() 
      : this.menus;
      
    return menusToSearch.filter(menu =>
      menu.name.toLowerCase().includes(lowercaseQuery) ||
      menu.description.toLowerCase().includes(lowercaseQuery) ||
      menu.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      menu.ingredients.some(ingredient => ingredient.toLowerCase().includes(lowercaseQuery))
    );
  }

  getSearchSuggestions(query: string): string[] {
    return this.cacheService.getSmartSuggestions(query);
  }

  getPopularMenus(): MenuItem[] {
    const popularIds = this.cacheService.getPopularMenus();
    return popularIds.map(id => this.menus.find(menu => menu.id === id)).filter(Boolean) as MenuItem[];
  }

  getRecentlyViewedMenus(): MenuItem[] {
    const recentIds = this.cacheService.getRecentlyViewedMenus();
    return recentIds.map(id => this.menus.find(menu => menu.id === id)).filter(Boolean) as MenuItem[];
  }

  getMenuNutritionSummary(menus: MenuItem[]) {
    return menus.reduce((summary, menu) => ({
      totalCalories: summary.totalCalories + menu.calories,
      totalProtein: summary.totalProtein + menu.protein,
      totalCarbs: summary.totalCarbs + menu.carbs,
      totalFat: summary.totalFat + menu.fat,
      totalFiber: summary.totalFiber + menu.fiber
    }), {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalFiber: 0
    });
  }
}