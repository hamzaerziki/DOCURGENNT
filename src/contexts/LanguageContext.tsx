// ...existing code...
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Comprehensive translations for the entire application
const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      features: 'Features',
      how: 'How it Works',
      about: 'About',
      login: 'Login',
      register: 'Register',
      levels: 'Levels'
    },
    
    // Common actions
    actions: {
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      submit: 'Submit',
      create: 'Create',
      update: 'Update',
      close: 'Close',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      search: 'Search',
      filter: 'Filter',
      clear: 'Clear',
      loading: 'Loading...',
      refresh: 'Refresh'
    },

    // Hero section
    hero: {
      title: 'Secure Document Delivery Across Borders',
      subtitle: 'Connect with verified travelers to deliver your important documents quickly and safely. From France to North Africa and beyond.',
      trusted: 'Trusted by thousands of users worldwide',
      cta: {
        sender: 'Send Documents',
        traveler: 'Become a Traveler'
      },
      stats: {
        users: 'Active Users',
        deliveries: 'Successful Deliveries',
        cities: 'Cities Connected',
        satisfaction: 'Satisfaction Rate'
      }
    },

    // Features section
    features: {
      title: 'Why Choose DocUrgent?',
      subtitle: 'Experience the most secure, fast, and reliable document delivery service with our advanced features.',
      secure: {
        title: 'Bank-Level Security',
        desc: 'Multi-layer verification, encrypted tracking, and secure handoff protocols ensure your documents are always protected.'
      },
      fast: {
        title: 'Lightning Fast',
        desc: 'Get your documents delivered in hours, not days. Our network of travelers ensures rapid delivery worldwide.'
      },
      tracking: {
        title: 'Real-Time Tracking',
        desc: 'Track your documents every step of the way with GPS location updates and instant notifications.'
      },
      insurance: {
        title: 'Full Insurance Coverage',
        desc: 'Complete protection for your valuable documents with comprehensive insurance coverage up to €10,000.'
      },
      support: {
        title: '24/7 Support',
        desc: 'Round-the-clock customer support and dispute resolution to ensure smooth delivery experience.'
      },
      affordable: {
        title: 'Competitive Pricing',
        desc: 'Transparent, fair pricing with no hidden fees. Pay only for what you need with flexible delivery options.'
      }
    },

    // How it works section
    howit: {
      title: 'How It Works',
      step1: {
        title: 'Verify & Register',
        desc: 'Create your account with multi-level verification including KYC and phone authentication for maximum security.'
      },
      step2: {
        title: 'Find & Connect',
        desc: 'Search for verified travelers on your route or post your delivery request to our trusted community.'
      },
      step3: {
        title: 'Track & Receive',
        desc: 'Monitor your delivery in real-time and receive your documents with secure QR code verification.'
      }
    },

    // Testimonials section
    testimonials: {
      title: 'What Our Users Say',
      subtitle: 'Join thousands of satisfied customers who trust DocUrgent for their document delivery needs.',
      1: {
        name: 'Sarah Martinez',
        location: 'Paris, France',
        text: 'DocUrgent saved me when I needed urgent visa documents delivered to Morocco. Fast, secure, and reliable!'
      },
      2: {
        name: 'Ahmed Khalil',
        location: 'Casablanca, Morocco',
        text: 'As a frequent traveler, I love earning extra income by helping others with document delivery. Great platform!'
      },
      3: {
        name: 'Fatima Benali',
        location: 'Tunis, Tunisia',
        text: 'The tracking system is amazing. I could see exactly where my documents were at all times. Highly recommended!'
      }
    },

    // CTA section
    cta: {
      title: 'Ready to Get Started?',
      subtitle: 'Join thousands of users who trust DocUrgent for secure document delivery.',
      button: 'Start Sending Now'
    },

    // Authentication
    auth: {
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      phone: 'Phone Number',
      city: 'City',
      noAccount: 'Don\'t have an account? Register here',
      hasAccount: 'Already have an account? Login here'
    },

    // Footer section
    footer: {
      company: 'Company',
      about: 'About Us',
      careers: 'Careers',
      press: 'Press',
      blog: 'Blog',
      support: 'Support',
      help: 'Help Center',
      contact: 'Contact Us',
      faq: 'FAQ',
      legal: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      cookies: 'Cookie Policy',
      rights: 'All rights reserved',
      relayAccess: 'Relay Point Access'
    },
    
    // Levels page
    levels: {
      title: 'Levels Management',
      subtitle: 'Manage categories and their levels',
      addLevel: 'Add Level',
      addCategory: 'Add Category',
      category: 'Category',
      categories: 'Categories',
      level: 'Level',
      levelName: 'Level Name',
      categoryName: 'Category Name',
      description: 'Description',
      noLevels: 'No levels in this category',
      noCategories: 'No categories found',
      createLevel: 'Create New Level',
      editLevel: 'Edit Level',
      deleteLevel: 'Delete Level',
      confirmDelete: 'Are you sure you want to delete this level?',
      levelCreated: 'Level created successfully',
      levelUpdated: 'Level updated successfully',
      levelDeleted: 'Level deleted successfully',
      enterLevelName: 'Enter level name',
      enterCategoryName: 'Enter category name',
      enterDescription: 'Enter description (optional)',
      required: 'This field is required'
    },
    
    // Verification
    verification: {
      verified: 'Verified',
      pending: 'Pending',
      unverified: 'Unverified',
      bronze: 'Bronze',
      silver: 'Silver',
      gold: 'Gold',
      platinum: 'Platinum',
      diamond: 'Diamond'
    },
    
    // Pages
    pages: {
      about: {
        title: 'About DocUrgent',
        subtitle: 'Connecting people for secure document delivery',
        intro: 'DocUrgent is a revolutionary platform that connects document senders with travelers to ensure fast, secure, and reliable document delivery across borders.',
        mission: {
          title: 'Our Mission',
          text: 'To provide a trustworthy, efficient, and cost-effective solution for urgent document delivery by leveraging the power of community and technology.'
        },
        why: {
          title: 'Why Choose DocUrgent?',
          item1: 'Verified travelers with multi-level authentication',
          item2: 'Real-time tracking and notifications',
          item3: 'Secure escrow payment system',
          item4: 'Competitive pricing with transparent fees',
          item5: '24/7 customer support and dispute resolution'
        }
      },
      contact: {
        title: 'Contact Us',
        subtitle: 'Get in touch with our team'
      }
    },
    
    // Dashboard
    dashboard: {
      sender: 'Sender Dashboard',
      traveler: 'Traveler Dashboard',
      recipient: 'Recipient Dashboard',
      welcome: 'Welcome',
      stats: 'Statistics',
      recentActivity: 'Recent Activity',
      notifications: 'Notifications',
      myTrips: 'My Trips',
      addTrip: 'Add New Trip'
    },

    // Common terms
    common: {
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Logout',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success'
    },

    // Sender dashboard
    sender: {
      dashboard: {
        title: 'Sender Dashboard',
        subtitle: 'Manage your document deliveries and track shipments',
        send_document: 'Send Document',
        find_travelers: 'Find Travelers',
        current_city: 'Current City',
        select_current_city: 'Select your current city',
        all_cities: 'All Cities',
        destination_country: 'Destination Country',
        select_destination_country: 'Select destination country',
        all_countries: 'All Countries',
        destination_city: 'Destination City',
        select_city: 'Select city',
        select_country_first: 'Select country first',
        search: 'Search',
        available_travelers: 'Available Travelers ({{count}})',
        no_travelers: 'No travelers found',
        adjust_filters: 'Try adjusting your search criteria or filters'
      },
      workflow: {
        title: 'Send Document',
        senderName: 'Your Name',
        senderNamePlaceholder: 'Enter your full name',
        senderPhone: 'Your Phone Number',
        senderPhonePlaceholder: 'Enter your phone number',
        sourceAddress: 'Pickup Address',
        sourceAddressPlaceholder: 'Enter pickup address',
        recipientInfo: 'Recipient Information',
        recipientName: 'Recipient Name',
        recipientNamePlaceholder: 'Enter recipient full name',
        recipientPhone: 'Recipient Phone Number',
        recipientPhonePlaceholder: 'Enter recipient phone number',
        destinationAddress: 'Delivery Address',
        destinationAddressPlaceholder: 'Enter delivery address',
        documentInfo: 'Document Information',
        documentType: 'Document Type',
        documentTypePlaceholder: 'e.g., Passport, Birth Certificate',
        documentDescription: 'Document Description',
        documentDescriptionPlaceholder: 'Brief description of the document',
        submit: 'Submit Request',
        confirmationTitle: 'Request Submitted Successfully',
        confirmationMessage: 'Your document request has been created. Please provide the codes below to the recipient.',
        uniqueCode: 'Unique Code',
        deliveryCode: 'Delivery Code',
        instructionsTitle: 'Next Steps',
        instruction1: 'Take your document to the nearest relay point',
        instruction2: 'Provide the Unique Code at the relay point for verification',
        instruction3: 'Give the Delivery Code to the recipient'
      }
    },

    // Send document flow
    send: {
      step7: {
        title: 'Payment Confirmed',
        subtitle: 'Your document is ready for drop-off',
        paymentConfirmed: 'Payment Confirmed!',
        dropOffMessage: 'Please drop off your document at the nearest relay point',
        instructionsTitle: 'Drop-off Instructions',
        dropOffCode: 'Drop-off Code',
        nearestPoint: 'Nearest Relay Point',
        hours: 'Hours',
        instructions: 'Instructions',
        step1: 'Bring your document and this code to the relay point',
        step2: 'Show the drop-off code to the staff',
        step3: 'They will scan and verify your document',
        step4: 'You will receive a confirmation receipt',
        completed: 'Mark as Completed'
      },
      complete: {
        whatNext: 'What happens next?',
        step1: 'Document dropped off at relay point',
        step2: '{name} will collect your document',
        step3: 'Real-time tracking during delivery',
        step4: 'Recipient receives document with confirmation'
      }
    },

    // Relay point
    relay: {
      title: 'Relay Point Dashboard',
      subtitle: 'Manage document drop-offs and pickups',
      search: {
        title: 'Search Documents',
        placeholder: 'Search by tracking code, sender name, or document type...'
      },
      header: {
        welcome: 'Relay Point Portal',
        logout: 'Logout'
      },
      status: {
        pending_pickup: 'Pending Pickup',
        in_transit: 'In Transit',
        delivered: 'Delivered',
        delivery_failed: 'Delivery Failed'
      }
    },
    
    // Added status translations
    
    // Secure workflow demo
    secureWorkflow: {
      title: 'Secure Document Workflow Demo',
      subtitle: 'Demonstration of the multi-step secure document delivery process',
      workflowDemo: 'Workflow Demonstration',
      resetDemo: 'Reset Demo',
      sender: 'Sender',
      relayPoint: 'Relay Point',
      traveler: 'Traveler',
      recipient: 'Recipient',
      securityLog: 'Security Log',
      noLogs: 'No security events logged yet'
    },
    
    // Common UI elements
    ui: {
      noData: 'No data available',
      loadMore: 'Load More',
      showMore: 'Show More',
      showLess: 'Show Less',
      selectOption: 'Select an option',
      selectDate: 'Select date',
      selectTime: 'Select time',
      uploadFile: 'Upload File',
      dragAndDrop: 'Drag and drop files here',
      or: 'or',
      and: 'and',
      of: 'of',
      page: 'Page',
      results: 'results',
      total: 'Total'
    }
  },
  
  fr: {
    // Navigation
    nav: {
      home: 'Accueil',
      features: 'Fonctionnalités',
      how: 'Comment ça marche',
      about: 'À propos',
      login: 'Connexion',
      register: 'S\'inscrire',
      levels: 'Niveaux'
    },
    
    // Common actions
    actions: {
      add: 'Ajouter',
      edit: 'Modifier',
      delete: 'Supprimer',
      save: 'Enregistrer',
      cancel: 'Annuler',
      submit: 'Soumettre',
      create: 'Créer',
      update: 'Mettre à jour',
      close: 'Fermer',
      confirm: 'Confirmer',
      back: 'Retour',
      next: 'Suivant',
      search: 'Rechercher',
      filter: 'Filtrer',
      clear: 'Effacer',
      loading: 'Chargement...',
      refresh: 'Actualiser'
    },

    // Hero section
    hero: {
      title: 'Livraison Sécurisée de Documents Transfrontalière',
      subtitle: 'Connectez-vous avec des voyageurs vérifiés pour livrer vos documents importants rapidement et en toute sécurité. De la France vers l\'Afrique du Nord et au-delà.',
      trusted: 'Fait confiance par des milliers d\'utilisateurs dans le monde',
      cta: {
        sender: 'Envoyer des Documents',
        traveler: 'Devenir Voyageur'
      },
      stats: {
        users: 'Utilisateurs Actifs',
        deliveries: 'Livraisons Réussies',
        cities: 'Villes Connectées',
        satisfaction: 'Taux de Satisfaction'
      }
    },

    // Features section
    features: {
      title: 'Pourquoi Choisir DocUrgent ?',
      subtitle: 'Découvrez le service de livraison de documents le plus sécurisé, rapide et fiable avec nos fonctionnalités avancées.',
      secure: {
        title: 'Sécurité Bancaire',
        desc: 'Vérification multicouche, suivi crypté et protocoles de remise sécurisés garantissent que vos documents sont toujours protégés.'
      },
      fast: {
        title: 'Ultra Rapide',
        desc: 'Recevez vos documents en quelques heures, pas en jours. Notre réseau de voyageurs assure une livraison rapide dans le monde entier.'
      },
      tracking: {
        title: 'Suivi en Temps Réel',
        desc: 'Suivez vos documents à chaque étape avec des mises à jour de localisation GPS et des notifications instantanées.'
      },
      insurance: {
        title: 'Couverture d\'Assurance Complète',
        desc: 'Protection complète pour vos documents précieux avec une couverture d\'assurance complète jusqu\'à 10 000 €.'
      },
      support: {
        title: 'Support 24/7',
        desc: 'Support client 24h/24 et résolution des litiges pour garantir une expérience de livraison fluide.'
      },
      affordable: {
        title: 'Prix Compétitifs',
        desc: 'Prix transparents et équitables sans frais cachés. Payez seulement ce dont vous avez besoin avec des options de livraison flexibles.'
      }
    },

    // How it works section
    howit: {
      title: 'Comment Ça Marche',
      step1: {
        title: 'Vérifier et S\'inscrire',
        desc: 'Créez votre compte avec une vérification multi-niveaux incluant KYC et authentification téléphonique pour une sécurité maximale.'
      },
      step2: {
        title: 'Trouver et Se Connecter',
        desc: 'Recherchez des voyageurs vérifiés sur votre itinéraire ou publiez votre demande de livraison à notre communauté de confiance.'
      },
      step3: {
        title: 'Suivre et Recevoir',
        desc: 'Surveillez votre livraison en temps réel et recevez vos documents avec vérification sécurisée par code QR.'
      }
    },

    // Testimonials section
    testimonials: {
      title: 'Ce Que Disent Nos Utilisateurs',
      subtitle: 'Rejoignez des milliers de clients satisfaits qui font confiance à DocUrgent pour leurs besoins de livraison de documents.',
      1: {
        name: 'Sarah Martinez',
        location: 'Paris, France',
        text: 'DocUrgent m\'a sauvé quand j\'avais besoin de documents de visa urgents livrés au Maroc. Rapide, sécurisé et fiable !'
      },
      2: {
        name: 'Ahmed Khalil',
        location: 'Casablanca, Maroc',
        text: 'En tant que voyageur fréquent, j\'adore gagner un revenu supplémentaire en aidant les autres avec la livraison de documents. Excellente plateforme !'
      },
      3: {
        name: 'Fatima Benali',
        location: 'Tunis, Tunisie',
        text: 'Le système de suivi est incroyable. Je pouvais voir exactement où étaient mes documents à tout moment. Hautement recommandé !'
      }
    },

    // CTA section
    cta: {
      title: 'Prêt à Commencer ?',
      subtitle: 'Rejoignez des milliers d\'utilisateurs qui font confiance à DocUrgent pour la livraison sécurisée de documents.',
      button: 'Commencer à Envoyer Maintenant'
    },

    // Authentication
    auth: {
      login: 'Connexion',
      register: 'S\'inscrire',
      email: 'Email',
      password: 'Mot de passe',
      firstName: 'Prénom',
      lastName: 'Nom',
      phone: 'Numéro de téléphone',
      city: 'Ville',
      noAccount: 'Pas de compte ? Inscrivez-vous ici',
      hasAccount: 'Déjà un compte ? Connectez-vous ici'
    },

    // Footer section
    footer: {
      company: 'Entreprise',
      about: 'À Propos',
      careers: 'Carrières',
      press: 'Presse',
      blog: 'Blog',
      support: 'Support',
      help: 'Centre d\'Aide',
      contact: 'Nous Contacter',
      faq: 'FAQ',
      legal: 'Légal',
      privacy: 'Politique de Confidentialité',
      terms: 'Conditions d\'Utilisation',
      cookies: 'Politique des Cookies',
      rights: 'Tous droits réservés',
      relayAccess: 'Accès Point Relais'
    },
    
    // Levels page
    levels: {
      title: 'Gestion des Niveaux',
      subtitle: 'Gérer les catégories et leurs niveaux',
      addLevel: 'Ajouter un Niveau',
      addCategory: 'Ajouter une Catégorie',
      category: 'Catégorie',
      categories: 'Catégories',
      level: 'Niveau',
      levelName: 'Nom du Niveau',
      categoryName: 'Nom de la Catégorie',
      description: 'Description',
      noLevels: 'Aucun niveau dans cette catégorie',
      noCategories: 'Aucune catégorie trouvée',
      createLevel: 'Créer un Nouveau Niveau',
      editLevel: 'Modifier le Niveau',
      deleteLevel: 'Supprimer le Niveau',
      confirmDelete: 'Êtes-vous sûr de vouloir supprimer ce niveau ?',
      levelCreated: 'Niveau créé avec succès',
      levelUpdated: 'Niveau mis à jour avec succès',
      levelDeleted: 'Niveau supprimé avec succès',
      enterLevelName: 'Entrez le nom du niveau',
      enterCategoryName: 'Entrez le nom de la catégorie',
      enterDescription: 'Entrez la description (optionnel)',
      required: 'Ce champ est obligatoire'
    },
    
    // Verification
    verification: {
      verified: 'Vérifié',
      pending: 'En attente',
      unverified: 'Non vérifié',
      bronze: 'Bronze',
      silver: 'Argent',
      gold: 'Or',
      platinum: 'Platine',
      diamond: 'Diamant'
    },
    
    // Pages
    pages: {
      about: {
        title: 'À propos de DocUrgent',
        subtitle: 'Connecter les personnes pour une livraison sécurisée de documents',
        intro: 'DocUrgent est une plateforme révolutionnaire qui connecte les expéditeurs de documents avec les voyageurs pour assurer une livraison rapide, sécurisée et fiable des documents à travers les frontières.',
        mission: {
          title: 'Notre Mission',
          text: 'Fournir une solution fiable, efficace et rentable pour la livraison urgente de documents en exploitant la puissance de la communauté et de la technologie.'
        },
        why: {
          title: 'Pourquoi choisir DocUrgent ?',
          item1: 'Voyageurs vérifiés avec authentification multi-niveaux',
          item2: 'Suivi en temps réel et notifications',
          item3: 'Système de paiement sécurisé avec séquestre',
          item4: 'Prix compétitifs avec frais transparents',
          item5: 'Support client 24/7 et résolution des litiges'
        }
      },
      contact: {
        title: 'Nous Contacter',
        subtitle: 'Entrez en contact avec notre équipe'
      }
    },
    
    // Dashboard
    dashboard: {
      sender: 'Tableau de Bord Expéditeur',
      traveler: 'Tableau de Bord Voyageur',
      recipient: 'Tableau de Bord Destinataire',
      welcome: 'Bienvenue',
      stats: 'Statistiques',
      recentActivity: 'Activité Récente',
      notifications: 'Notifications',
      myTrips: 'Mes Voyages',
      addTrip: 'Ajouter un Voyage'
    },
    
    // Recipient workflow
    recipient: {
      workflow: {
        lookupTitle: 'Recherche de Document',
        requestId: 'ID de la Demande',
        requestIdPlaceholder: 'Entrez l\'ID de la demande de document',
        lookupButton: 'Rechercher le Document',
        confirmationTitle: 'Livraison du Document',
        deliveryArrived: 'Le Document est Arrivé',
        deliveryMessage: 'Votre document a été livré par le voyageur',
        documentInfo: 'Informations sur le Document',
        sender: 'Expéditeur',
        traveler: 'Voyageur',
        documentType: 'Type de Document',
        confirmationCode: 'Code de Confirmation',
        confirmationCodePlaceholder: 'Entrez le code de confirmation du voyageur',
        confirmationInstructions: 'Instructions de Confirmation',
        instruction1: 'Vérifiez l\'identité du voyageur',
        instruction2: 'Vérifiez l\'intégrité du document',
        instruction3: 'Fournissez la confirmation pour terminer la livraison',
        confirmDelivery: 'Confirmer la Livraison'
      }
    },

    // Common terms
    common: {
      profile: 'Profil',
      settings: 'Paramètres',
      logout: 'Déconnexion',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès'
    },

    // Sender dashboard
    sender: {
      dashboard: {
        title: 'Tableau de Bord Expéditeur',
        subtitle: 'Gérez vos livraisons de documents et suivez les expéditions',
        send_document: 'Envoyer un Document',
        find_travelers: 'Trouver des Voyageurs',
        current_city: 'Ville Actuelle',
        select_current_city: 'Sélectionnez votre ville actuelle',
        all_cities: 'Toutes les Villes',
        destination_country: 'Pays de Destination',
        select_destination_country: 'Sélectionnez le pays de destination',
        all_countries: 'Tous les Pays',
        destination_city: 'Ville de Destination',
        select_city: 'Sélectionnez la ville',
        select_country_first: 'Sélectionnez d\'abord le pays',
        search: 'Rechercher',
        available_travelers: 'Voyageurs Disponibles ({{count}})',
        no_travelers: 'Aucun voyageur trouvé',
        adjust_filters: 'Essayez d\'ajuster vos critères de recherche ou filtres'
      }
    },

    // Send document flow
    send: {
      step7: {
        title: 'Paiement Confirmé',
        subtitle: 'Votre document est prêt pour le dépôt',
        paymentConfirmed: 'Paiement Confirmé !',
        dropOffMessage: 'Veuillez déposer votre document au point relais le plus proche',
        instructionsTitle: 'Instructions de Dépôt',
        dropOffCode: 'Code de Dépôt',
        nearestPoint: 'Point Relais le Plus Proche',
        hours: 'Horaires',
        instructions: 'Instructions',
        step1: 'Apportez votre document et ce code au point relais',
        step2: 'Montrez le code de dépôt au personnel',
        step3: 'Ils scanneront et vérifieront votre document',
        step4: 'Vous recevrez un reçu de confirmation',
        completed: 'Marquer comme Terminé'
      },
      complete: {
        whatNext: 'Que se passe-t-il ensuite ?',
        step1: 'Document déposé au point relais',
        step2: '{name} récupérera votre document',
        step3: 'Suivi en temps réel pendant la livraison',
        step4: 'Le destinataire reçoit le document avec confirmation'
      }
    },

    // Common navigation
    profile: 'Profil',
    home: 'Accueil',

    // Traveler details modal
    travelerDetails: {
      title: 'Détails du Voyageur',
      reviews: 'avis',
      deliveriesCompleted: 'livraisons terminées',
      idVerified: 'ID Vérifié',
      tripInfo: 'Informations du Voyage',
      from: 'De',
      to: 'Vers',
      departureDate: 'Date de Départ',
      availableSpots: 'Places Disponibles',
      spotsLeft: 'places restantes',
      flightDetails: 'Détails du Vol',
      pricePerDocument: 'Prix par document',
      recentReviews: 'Avis Récents',
      requestDelivery: 'Demander une Livraison'
    },
    
    // Traveler workflow
    traveler: {
      workflow: {
        lookupTitle: 'Recherche de Document',
        requestId: 'ID de la Demande',
        requestIdPlaceholder: 'Entrez l\'ID de la demande de document',
        lookupButton: 'Rechercher le Document',
        collectionTitle: 'Collecte du Document',
        documentInfo: 'Informations sur le Document',
        sender: 'Expéditeur',
        recipient: 'Destinataire',
        documentType: 'Type de Document',
        collectionInstructions: 'Instructions de Collecte',
        instruction1: 'Vérifiez votre identité avec le personnel du point relais',
        instruction2: 'Collectez le document physique',
        instruction3: 'Vérifiez l\'intégrité du document avant de partir',
        collectDocument: 'Collecter le Document',
        deliveryTitle: 'Livraison du Document',
        deliveryReady: 'Prêt pour la Livraison',
        deliveryMessage: 'Le document est prêt à être livré au destinataire',
        deliveryDetails: 'Détails de Livraison',
        destination: 'Destination',
        deliveryCode: 'Code de Livraison',
        handoverInstructions: 'Instructions de Livraison',
        deliveryInstruction1: 'Contactez le destinataire avant la livraison',
        deliveryInstruction2: 'Vérifiez l\'identité du destinataire',
        deliveryInstruction3: 'Fournissez le code de livraison au destinataire',
        confirmDelivery: 'Confirmer la Livraison'
      }
    },

    // Trips
    trips: {
      addTrip: 'Ajouter un Voyage',
      editTrip: 'Modifier le Voyage',
      deleteTrip: 'Supprimer le Voyage',
      manageTrips: 'Gérer les Voyages',
      tripDetails: 'Détails du Voyage',
      confirmDeleteTrip: 'Êtes-vous sûr de vouloir supprimer ce voyage ?',
      departureCity: 'Ville de Départ',
      arrivalCity: 'Ville d\'Arrivée',
      departureDate: 'Date de Départ',
      arrivalDate: 'Date d\'Arrivée',
      selectCity: 'Sélectionner une ville',
      selectDate: 'Sélectionner la date',
      tripCreated: 'Voyage créé avec succès',
      tripUpdated: 'Voyage mis à jour avec succès',
      tripDeleted: 'Voyage supprimé avec succès'
    },
    
    // Forms
    forms: {
      email: 'Email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      firstName: 'Prénom',
      lastName: 'Nom',
      phone: 'Numéro de téléphone',
      address: 'Adresse',
      city: 'Ville',
      country: 'Pays',
      zipCode: 'Code postal',
      required: 'Obligatoire',
      optional: 'Optionnel',
      invalidEmail: 'Adresse email invalide',
      passwordTooShort: 'Le mot de passe doit contenir au moins 8 caractères',
      passwordMismatch: 'Les mots de passe ne correspondent pas'
    },
    
    // Status messages
    status: {
      success: 'Succès',
      error: 'Erreur',
      warning: 'Avertissement',
      info: 'Information',
      pending: 'En attente',
      completed: 'Terminé',
      cancelled: 'Annulé',
      inProgress: 'En cours'
    },
    
    // Relay point
    relay: {
      title: 'Tableau de Bord Point Relais',
      subtitle: 'Gérer les dépôts et collectes de documents',
      search: {
        title: 'Rechercher des Documents',
        placeholder: 'Rechercher par code de suivi, nom de l\'expéditeur, ou type de document...'
      },
      header: {
        welcome: 'Portail Point Relais',
        logout: 'Déconnexion'
      },
      status: {
        pending_pickup: 'En Attente de Ramassage',
        in_transit: 'En Transit',
        delivered: 'Livré',
        delivery_failed: 'Échec de Livraison'
      }
    },
    
    // Secure workflow demo
    secureWorkflow: {
      title: 'Démonstration du Flux de Travail Sécurisé',
      subtitle: 'Démonstration du processus de livraison sécurisé en plusieurs étapes',
      workflowDemo: 'Démonstration du Flux de Travail',
      resetDemo: 'Réinitialiser la Démo',
      sender: 'Expéditeur',
      relayPoint: 'Point Relais',
      traveler: 'Voyageur',
      recipient: 'Destinataire',
      securityLog: 'Journal de Sécurité',
      noLogs: 'Aucun événement de sécurité enregistré pour le moment'
    },
    
    // Common UI elements
    ui: {
      noData: 'Aucune donnée disponible',
      loadMore: 'Charger plus',
      showMore: 'Afficher plus',
      showLess: 'Afficher moins',
      selectOption: 'Sélectionner une option',
      selectDate: 'Sélectionner la date',
      selectTime: 'Sélectionner l\'heure',
      uploadFile: 'Télécharger un fichier',
      dragAndDrop: 'Glissez et déposez les fichiers ici',
      or: 'ou',
      and: 'et',
      of: 'de',
      page: 'Page',
      results: 'résultats',
      total: 'Total'
    }
  }
};

type LangKey = keyof typeof translations;

type LanguageContextType = {
  language: LangKey;
  setLanguage: (lang: LangKey) => void;
  t: (key: string, params?: Record<string, any>) => string;
};

// default language for fallback
const defaultLanguage: LangKey = 'en';

// Create context AFTER translations/defaults exist
const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  t: (key: string, params?: Record<string, any>) => {
    const getValue = (obj: any, path: string) => {
      return path.split('.').reduce((current, prop) => current?.[prop], obj);
    };
    let translation = getValue(translations[defaultLanguage], key) ?? key;
    if (params && typeof translation === 'string') {
      Object.keys(params).forEach(param => {
        translation = translation.replace(new RegExp(`\\{\\{${param}\\}\\}`, 'g'), params[param]);
      });
    }
    return translation;
  }
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<LangKey>(defaultLanguage);

  const t = (key: string, params?: Record<string, any>) => {
    const getValue = (obj: any, path: string) => {
      return path.split('.').reduce((current, prop) => current?.[prop], obj);
    };
    
    let translation = getValue(translations[language], key) ?? getValue(translations[defaultLanguage], key) ?? key;
    
    // Handle interpolation
    if (params && typeof translation === 'string') {
      Object.keys(params).forEach(param => {
        translation = translation.replace(new RegExp(`\\{\\{${param}\\}\\}`, 'g'), params[param]);
      });
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);




