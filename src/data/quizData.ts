export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export const quizData: Quiz[] = [
  {
    id: "cell-biology",
    title: "Cell Biology",
    description: "Basic concepts of cell structure and function",
    questions: [
      {
        id: "cell-1",
        question: "What is the basic unit of life?",
        options: ["Tissue", "Cell", "Organ", "Organism"],
        correctAnswer: 1,
        explanation: "The cell is the fundamental structural and functional unit of all living organisms."
      },
      {
        id: "cell-2",
        question: "Which organelle is responsible for energy production in cells?",
        options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"],
        correctAnswer: 1,
        explanation: "Mitochondria are known as the powerhouses of the cell, producing ATP through cellular respiration."
      },
      {
        id: "cell-3",
        question: "What controls what enters and exits the cell?",
        options: ["Cell wall", "Cytoplasm", "Cell membrane", "Nucleus"],
        correctAnswer: 2,
        explanation: "The cell membrane is selectively permeable, controlling the passage of substances in and out of the cell."
      },
      {
        id: "cell-4",
        question: "Where is genetic material stored in eukaryotic cells?",
        options: ["Cytoplasm", "Nucleus", "Mitochondria", "Ribosome"],
        correctAnswer: 1,
        explanation: "In eukaryotic cells, DNA is contained within the nucleus, which is enclosed by a nuclear membrane."
      }
    ]
  },
  {
    id: "genetics",
    title: "Genetics",
    description: "Principles of heredity and genetic variation",
    questions: [
      {
        id: "gen-1",
        question: "What is DNA short for?",
        options: ["Deoxyribose nucleic acid", "Deoxyribonucleic acid", "Diribonucleic acid", "Double nucleic acid"],
        correctAnswer: 1,
        explanation: "DNA stands for Deoxyribonucleic acid, the molecule that carries genetic information."
      },
      {
        id: "gen-2",
        question: "How many chromosomes do humans have?",
        options: ["44", "45", "46", "48"],
        correctAnswer: 2,
        explanation: "Humans have 46 chromosomes arranged in 23 pairs, with one chromosome from each pair inherited from each parent."
      },
      {
        id: "gen-3",
        question: "What is a gene?",
        options: ["A type of cell", "A segment of DNA", "A chromosome", "A protein"],
        correctAnswer: 1,
        explanation: "A gene is a specific sequence of DNA that codes for a particular trait or protein."
      },
      {
        id: "gen-4",
        question: "Which scientist is known for the laws of inheritance?",
        options: ["Darwin", "Watson", "Mendel", "Crick"],
        correctAnswer: 2,
        explanation: "Gregor Mendel discovered the fundamental laws of inheritance through his work with pea plants."
      }
    ]
  },
  {
    id: "ecology",
    title: "Ecology",
    description: "Interactions between organisms and their environment",
    questions: [
      {
        id: "eco-1",
        question: "What is an ecosystem?",
        options: ["Only living organisms", "Only non-living factors", "Living and non-living components interacting", "Just plants and animals"],
        correctAnswer: 2,
        explanation: "An ecosystem includes all living organisms and their physical environment interacting as a system."
      },
      {
        id: "eco-2",
        question: "What are producers in an ecosystem?",
        options: ["Carnivores", "Herbivores", "Plants", "Decomposers"],
        correctAnswer: 2,
        explanation: "Producers, primarily plants, make their own food through photosynthesis and form the base of food chains."
      },
      {
        id: "eco-3",
        question: "What is biodiversity?",
        options: ["Number of animals", "Variety of life forms", "Size of habitat", "Population density"],
        correctAnswer: 1,
        explanation: "Biodiversity refers to the variety of life in all its forms, including genetic, species, and ecosystem diversity."
      },
      {
        id: "eco-4",
        question: "What is the greenhouse effect?",
        options: ["Plants growing in greenhouses", "Warming of Earth's atmosphere", "Cooling of the planet", "Destruction of ozone"],
        correctAnswer: 1,
        explanation: "The greenhouse effect is the warming of Earth's atmosphere due to greenhouse gases trapping heat from the sun."
      }
    ]
  },
  {
    id: "evolution",
    title: "Evolution",
    description: "Theory of evolution and natural selection",
    questions: [
      {
        id: "evo-1",
        question: "Who proposed the theory of evolution by natural selection?",
        options: ["Lamarck", "Darwin", "Mendel", "Wallace"],
        correctAnswer: 1,
        explanation: "Charles Darwin proposed the theory of evolution by natural selection in his book 'On the Origin of Species'."
      },
      {
        id: "evo-2",
        question: "What is natural selection?",
        options: ["Random changes", "Survival of the fittest", "Genetic mutations", "Environmental disasters"],
        correctAnswer: 1,
        explanation: "Natural selection is the process where organisms with favorable traits are more likely to survive and reproduce."
      },
      {
        id: "evo-3",
        question: "What are fossils?",
        options: ["Living organisms", "Rocks", "Preserved remains of organisms", "Modern bones"],
        correctAnswer: 2,
        explanation: "Fossils are preserved remains or traces of organisms that lived in the past, providing evidence of evolution."
      },
      {
        id: "evo-4",
        question: "What is adaptation?",
        options: ["Random change", "Inherited trait that helps survival", "Learning new skills", "Changing environment"],
        correctAnswer: 1,
        explanation: "An adaptation is an inherited characteristic that helps an organism survive and reproduce in its environment."
      }
    ]
  }
];