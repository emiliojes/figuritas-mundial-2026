function teamSection(id, name, flag, group, players) {
  return {
    id,
    name,
    flag,
    group,
    stickers: Array.from({ length: 20 }, (_, i) => ({
      id: `${id}-${i + 1}`,
      number: `${id} ${i + 1}`,
      name: players[i] ?? `Jugador ${i + 1}`,
    })),
  };
}

export const SECTIONS = [
  {
    id: 'FWC',
    name: 'FIFA World Cup 2026',
    flag: '🏆',
    group: 'Intro',
    stickers: [
      { id: 'FWC-1',  number: 'FWC 1',  name: 'Official Emblem (FOIL)' },
      { id: 'FWC-2',  number: 'FWC 2',  name: 'Official Emblem (FOIL)' },
      { id: 'FWC-3',  number: 'FWC 3',  name: 'Official Mascots (FOIL)' },
      { id: 'FWC-4',  number: 'FWC 4',  name: 'Official Slogan (FOIL)' },
      { id: 'FWC-5',  number: 'FWC 5',  name: 'Official Ball (FOIL)' },
      { id: 'FWC-6',  number: 'FWC 6',  name: 'Canada - Host Countries & Cities (FOIL)' },
      { id: 'FWC-7',  number: 'FWC 7',  name: 'Mexico - Host Countries & Cities (FOIL)' },
      { id: 'FWC-8',  number: 'FWC 8',  name: 'USA - Host Countries & Cities (FOIL)' },
      { id: 'FWC-9',  number: 'FWC 9',  name: 'Italy 1934 - World Cup History (FOIL)' },
      { id: 'FWC-10', number: 'FWC 10', name: 'Uruguay 1950 - World Cup History (FOIL)' },
      { id: 'FWC-11', number: 'FWC 11', name: 'West Germany 1954 - World Cup History (FOIL)' },
      { id: 'FWC-12', number: 'FWC 12', name: 'Brazil 1962 - World Cup History (FOIL)' },
      { id: 'FWC-13', number: 'FWC 13', name: 'West Germany 1974 - World Cup History (FOIL)' },
      { id: 'FWC-14', number: 'FWC 14', name: 'Argentina 1986 - World Cup History (FOIL)' },
      { id: 'FWC-15', number: 'FWC 15', name: 'Brazil 1994 - World Cup History (FOIL)' },
      { id: 'FWC-16', number: 'FWC 16', name: 'Brazil 2002 - World Cup History (FOIL)' },
      { id: 'FWC-17', number: 'FWC 17', name: 'Italy 2006 - World Cup History (FOIL)' },
      { id: 'FWC-18', number: 'FWC 18', name: 'Germany 2014 - World Cup History (FOIL)' },
      { id: 'FWC-19', number: 'FWC 19', name: 'Argentina 2022 - World Cup History (FOIL)' },
    ],
  },

  // ── GRUPO A ────────────────────────────────────────────────────
  teamSection('MEX', 'México', '🇲🇽', 'A', [
    'Escudo (FOIL)', 'Luis Malagón', 'Johan Vasquez', 'Jorge Sánchez',
    'Cesar Montes', 'Jesus Gallardo', 'Israel Reyes', 'Diego Lainez',
    'Carlos Rodriguez', 'Edson Alvarez', 'Orbelin Pineda', 'Marcel Ruiz',
    'Foto equipo', 'Érick Sánchez', 'Hirving Lozano', 'Santiago Giménez',
    'Raúl Jiménez', 'Alexis Vega', 'Roberto Alvarado', 'Cesar Huerta',
  ]),
  teamSection('RSA', 'Sudáfrica', '🇿🇦', 'A', [
    'Escudo (FOIL)', 'Ronwen Williams', 'Sipho Chaine', 'Aubrey Modiba',
    'Samukele Kabini', 'Mbekezeli Mbokazi', 'Khulumani Ndamane', 'Siyabonga Ngezana',
    'Khuliso Mudau', 'Nkosinathi Sibisi', 'Teboho Mokoena', 'Thalente Mbatha',
    'Foto equipo', 'Bathasi Aubaas', 'Yaya Sithole', 'Sipho Mbule',
    'Lyle Foster', 'Iqraam Rayners', 'Mohau Nkota', 'Oswin Appollis',
  ]),
  teamSection('KOR', 'Corea del Sur', '🇰🇷', 'A', [
    'Escudo (FOIL)', 'Hyeon-woo Jo', 'Seung-Gyu Kim', 'Min-jae Kim',
    'Yu-min Cho', 'Young-woo Seol', 'Han-beom Lee', 'Tae-seok Lee',
    'Myung-jae Lee', 'Jae-sung Lee', 'In-beom Hwang', 'Kang-in Lee',
    'Foto equipo', 'Seung-ho Paik', 'Jens Castrop', 'Dongg-yeong Lee',
    'Gue-sung Cho', 'Heung-min Son', 'Hee-chan Hwang', 'Hyeon-Gyu Oh',
  ]),
  teamSection('CZE', 'Chequia', '🇨🇿', 'A', [
    'Escudo (FOIL)', 'Matej Kovar', 'Jindrich Stanek', 'Ladislav Krejci',
    'Vladimir Coufal', 'Jaroslav Zeleny', 'Tomas Holes', 'David Zima',
    'Michal Sadilek', 'Lukas Provod', 'Lukas Cerv', 'Tomas Soucek',
    'Foto equipo', 'Pavel Sulc', 'Matej Vydra', 'Vasil Kusej',
    'Tomas Chory', 'Vaclav Cerny', 'Adam Hlozek', 'Patrik Schick',
  ]),

  // ── GRUPO B ────────────────────────────────────────────────────
  teamSection('CAN', 'Canadá', '🇨🇦', 'B', [
    'Escudo (FOIL)', 'Dayne St. Clair', 'Alphonso Davies', 'Alistair Johnston',
    'Samuel Adekugbe', 'Richie Larvea', 'Derek Cornelius', 'Moïse Bombito',
    'Kamal Miller', 'Stephen Eustáquio', 'Ismaël Koné', 'Jonathan Osorio',
    'Foto equipo', 'Jacob Shaffelburg', 'Mathieu Choinière', 'Niko Sigur',
    'Tajon Buchanan', 'Liam Millar', 'Cyle Larin', 'Jonathan David',
  ]),
  teamSection('BIH', 'Bosnia-Herzegovina', '🇧🇦', 'B', [
    'Escudo (FOIL)', 'Nikola Vasilj', 'Amer Dedic', 'Sead Kolasinac',
    'Tarik Muharemovic', 'Nihad Mujakic', 'Nikola Katic', 'Amir Hadziahmetovic',
    'Benjamin Tahirovic', 'Armin Gigovic', 'Ivan Sunjic', 'Ivan Basic',
    'Foto equipo', 'Dzenis Burnic', 'Esmir Bajraktarevic', 'Amar Memic',
    'Ermedin Demirovic', 'Edin Dzeko', 'Samed Bazdar', 'Haris Tabakovic',
  ]),
  teamSection('QAT', 'Qatar', '🇶🇦', 'B', [
    'Escudo (FOIL)', 'Meshaal Barsham', 'Sultan Albrake', 'Lucas Mendes',
    'Homam Ahmed', 'Boualem Khoukhi', 'Pedro Miguel', 'Tarek Salman',
    'Mohamed Al-Mannai', 'Karim Boudiaf', 'Assim Madibo', 'Ahmed Fatehi',
    'Foto equipo', 'Mohammed Waad', 'Abdulaziz Hatem', 'Hassan Al-Haydos',
    'Edmilson Junior', 'Akram Hassan Afif', 'Ahmed Al Ganehi', 'Almoez Ali',
  ]),
  teamSection('SUI', 'Suiza', '🇨🇭', 'B', [
    'Escudo (FOIL)', 'Gregor Kobel', 'Yvon Mvogo', 'Manuel Akanji',
    'Ricardo Rodriguez', 'Nico Elvedi', 'Aurèle Amenda', 'Silvan Widmer',
    'Granit Xhaka', 'Denis Zakaria', 'Remo Freuler', 'Fabian Rieder',
    'Foto equipo', 'Ardon Jashari', 'Johan Manzambi', 'Michel Aebischer',
    'Breel Embolo', 'Ruben Vargas', 'Dan Ndoye', 'Zeki Amdouni',
  ]),

  // ── GRUPO C ────────────────────────────────────────────────────
  teamSection('USA', 'Estados Unidos', '🇺🇸', 'C', [
    'Escudo (FOIL)', 'Matt Freese', 'Chris Richards', 'Tim Ream',
    'Mark McKenzie', 'Alex Freeman', 'Antonee Robinson', 'Tyler Adams',
    'Tanner Tessmann', 'Weston McKennie', 'Christian Roldan', 'Timothy Weah',
    'Foto equipo', 'Diego Luna', 'Malik Tillman', 'Christian Pulisic',
    'Brenden Aaronson', 'Ricardo Pepi', 'Haji Wright', 'Folarin Balogun',
  ]),
  teamSection('PAR', 'Paraguay', '🇵🇾', 'C', [
    'Escudo (FOIL)', 'Roberto Fernandez', 'Orlando Gill', 'Gustavo Gomez',
    'Fabián Balbuena', 'Juan José Cáceres', 'Omar Alderete', 'Junior Alonso',
    'Mathías Villasanti', 'Diego Gomez', 'Damián Bobadilla', 'Andres Cubas',
    'Foto equipo', 'Matias Galarza Fonda', 'Julio Enciso', 'Alejandro Romero Gamarra',
    'Miguel Almirón', 'Ramon Sosa', 'Angel Romero', 'Antonio Sanabria',
  ]),
  teamSection('AUS', 'Australia', '🇦🇺', 'C', [
    'Escudo (FOIL)', 'Mathew Ryan', 'Joe Gauci', 'Harry Souttar',
    'Alessandro Circati', 'Jordan Bos', 'Aziz Behich', 'Cameron Burgess',
    'Lewis Miller', 'Milos Degenek', 'Jackson Irvine', 'Riley McGree',
    'Foto equipo', 'Aiden O\'Neill', 'Connor Metcalfe', 'Patrick Yazbek',
    'Craig Goodwin', 'Kusini Yengi', 'Nestory Irankunda', 'Mohamed Touré',
  ]),
  teamSection('TUR', 'Türkiye', '🇹🇷', 'C', [
    'Escudo (FOIL)', 'Ugurcan Cakir', 'Mert Muldur', 'Zeki Celik',
    'Abdulkerim Bardakci', 'Caglar Soyuncu', 'Merih Demiral', 'Ferdi Kadioglu',
    'Kaan Ayhan', 'Ismail Yuksek', 'Hakan Calhanoglu', 'Orkun Kokcu',
    'Foto equipo', 'Arda Guler', 'Irfan Can Kahveci', 'Yunus Akgun',
    'Can Uzun', 'Baris Alper Yilmaz', 'Kerem Akturkoglu', 'Kenan Yildiz',
  ]),

  // ── GRUPO D ────────────────────────────────────────────────────
  teamSection('NED', 'Países Bajos', '🇳🇱', 'D', [
    'Escudo (FOIL)', 'Bart Verbruggen', 'Virgil van Dijk', 'Micky van de Ven',
    'Jurrien Timber', 'Denzel Dumfries', 'Nathan Aké', 'Jeremie Frimpong',
    'Jan Paul van Hecke', 'Tijjani Reijnders', 'Ryan Gravenberch', 'Teun Koopmeiners',
    'Foto equipo', 'Frenkie de Jong', 'Xavi Simons', 'Justin Kluivert',
    'Memphis Depay', 'Donyell Malen', 'Wout Weghorst', 'Cody Gakpo',
  ]),
  teamSection('JPN', 'Japón', '🇯🇵', 'D', [
    'Escudo (FOIL)', 'Zion Suzuki', 'Henry Heroki Mochizuki', 'Ayumu Seko',
    'Junnosuke Suzuki', 'Shogo Taniguchi', 'Tsuyoshi Watanabe', 'Kaishu Sano',
    'Yuki Soma', 'Ao Tanaka', 'Daichi Kamada', 'Takefusa Kubo',
    'Foto equipo', 'Ritsu Doan', 'Keito Nakamura', 'Takumi Minamino',
    'Shuto Machino', 'Junya Ito', 'Koki Ogawa', 'Ayase Ueda',
  ]),
  teamSection('SWE', 'Suecia', '🇸🇪', 'D', [
    'Escudo (FOIL)', 'Victor Johansson', 'Isak Hien', 'Gabriel Gudmundsson',
    'Emil Holm', 'Victor Nilsson Lindelöf', 'Gustaf Lagerbielke', 'Lucas Bergvall',
    'Hugo Larsson', 'Jesper Karlström', 'Yasin Ayari', 'Mattias Svanberg',
    'Foto equipo', 'Daniel Svensson', 'Ken Sema', 'Roony Bardghji',
    'Dejan Kulusevski', 'Anthony Elanga', 'Alexander Isak', 'Viktor Gyökeres',
  ]),
  teamSection('TUN', 'Túnez', '🇹🇳', 'D', [
    'Escudo (FOIL)', 'Bechir Ben Said', 'Aymen Dahmen', 'Yan Valery',
    'Montassar Talbi', 'Yassine Meriah', 'Ali Abdi', 'Dylan Bronn',
    'Ellyes Skhiri', 'Aissa Laidouni', 'Ferjani Sassi', 'Mohamed Ali Ben Romdhane',
    'Foto equipo', 'Hannibal Mejbri', 'Elias Achouri', 'Elias Saad',
    'Hazem Mastouri', 'Ismael Gharbi', 'Sayfallah Ltaief', 'Naim Sliti',
  ]),

  // ── GRUPO E ────────────────────────────────────────────────────
  teamSection('GER', 'Alemania', '🇩🇪', 'E', [
    'Escudo (FOIL)', 'Marc-André ter Stegen', 'Jonathan Tah', 'David Raum',
    'Nico Schlotterbeck', 'Antonio Rüdiger', 'Waldemar Anton', 'Ridle Baku',
    'Maximilian Mittelstadt', 'Joshua Kimmich', 'Florian Wirtz', 'Felix Nmecha',
    'Foto equipo', 'Leon Goretzka', 'Jamal Musiala', 'Serge Gnabry',
    'Kai Havertz', 'Leroy Sane', 'Karim Adeyemi', 'Nick Woltemade',
  ]),
  teamSection('CUW', 'Curaçao', '🇨🇼', 'E', [
    'Escudo (FOIL)', 'Eloy Room', 'Armando Obispo', 'Sherel Floranus',
    'Jurien Gaari', 'Joshua Brenet', 'Roshon Van Eijma', 'Shurandy Sambo',
    'Livano Comenencia', 'Godfried Roemeratoe', 'Juninho Bacuna', 'Leandro Bacuna',
    'Foto equipo', 'Tahith Chong', 'Kenji Gorre', 'Jearl Margaritha',
    'Jurgen Locadia', 'Jeremy Antonisse', 'Gervane Kastaneer', 'Sontje Hansen',
  ]),
  teamSection('CIV', 'Costa de Marfil', '🇨🇮', 'E', [
    'Escudo (FOIL)', 'Yahia Fofana', 'Ghislain Konan', 'Wilfried Singo',
    'Odilon Kossounou', 'Evan Ndicka', 'Willy Boly', 'Emmanuel Agbadou',
    'Ousmane Diomande', 'Franck Kessie', 'Seko Fofana', 'Ibrahim Sangare',
    'Foto equipo', 'Jean-Philippe Gbamin', 'Amad Diallo', 'Sébastien Haller',
    'Simon Adingra', 'Yan Diomande', 'Evann Guessand', 'Oumar Diakite',
  ]),
  teamSection('ECU', 'Ecuador', '🇪🇨', 'E', [
    'Escudo (FOIL)', 'Hernán Galíndez', 'Gonzalo Valle', 'Piero Hincapié',
    'Pervis Estupiñán', 'Willian Pacho', 'Ángelo Preciado', 'Joel Ordóñez',
    'Moises Caicedo', 'Alan Franco', 'Kendry Paez', 'Pedro Vite',
    'Foto equipo', 'John Yeboah', 'Leonardo Campana', 'Gonzalo Plata',
    'Nilson Angulo', 'Alan Minda', 'Kevin Rodriguez', 'Enner Valencia',
  ]),

  // ── GRUPO F ────────────────────────────────────────────────────
  teamSection('BEL', 'Bélgica', '🇧🇪', 'F', [
    'Escudo (FOIL)', 'Thibaut Courtois', 'Arthur Theate', 'Timothy Castagne',
    'Zeno Debast', 'Brandon Mechele', 'Maxim De Cuyper', 'Thomas Meunier',
    'Youri Tielemans', 'Amadou Onana', 'Nicolas Raskin', 'Alexis Saelemaekers',
    'Foto equipo', 'Hans Vanaken', 'Kevin De Bruyne', 'Jérémy Doku',
    'Charles De Ketelaere', 'Leandro Trossard', 'Loïs Openda', 'Romelu Lukaku',
  ]),
  teamSection('EGY', 'Egipto', '🇪🇬', 'F', [
    'Escudo (FOIL)', 'Mohamed El Shenawy', 'Mohamed Hany', 'Mohamed Hamdy',
    'Yasser Ibrahim', 'Khaled Sobhi', 'Ramy Rabia', 'Hossam Abdelmaguid',
    'Ahmed Fatouh', 'Marwan Attia', 'Zizo', 'Hamdy Fathy',
    'Foto equipo', 'Mohamed Lasheen', 'Emam Ashour', 'Osama Faisal',
    'Mohamed Salah', 'Mostafa Mohamed', 'Trezeguet', 'Omar Marmoush',
  ]),
  teamSection('IRN', 'IR Irán', '🇮🇷', 'F', [
    'Escudo (FOIL)', 'Alireza Beiranvand', 'Morteza Pouraliganji', 'Ehsan Hajsafi',
    'Milad Mohammadi', 'Shojae Khalilzadeh', 'Ramin Rezaeian', 'Hossein Kanaani',
    'Sadegh Moharrami', 'Saleh Hardani', 'Saeed Ezatolahi', 'Saman Ghoddos',
    'Foto equipo', 'Omid Noorafkan', 'Roozbeh Cheshmi', 'Mohammad Mohebi',
    'Sardar Azmoun', 'Mehdi Taremi', 'Alireza Jahanbakhsh', 'Ali Gholizadeh',
  ]),
  teamSection('NZL', 'Nueva Zelanda', '🇳🇿', 'F', [
    'Escudo (FOIL)', 'Max Crocombe', 'Alex Paulsen', 'Michael Boxall',
    'Liberato Cacace', 'Tim Payne', 'Tyler Bindon', 'Francis de Vries',
    'Finn Surman', 'Joe Bell', 'Sarpreet Singh', 'Ryan Thomas',
    'Foto equipo', 'Matthew Garbett', 'Marko Stamenić', 'Ben Old',
    'Chris Wood', 'Elijah Just', 'Callum McCowatt', 'Kosta Barbarouses',
  ]),

  // ── GRUPO G ────────────────────────────────────────────────────
  teamSection('ESP', 'España', '🇪🇸', 'G', [
    'Escudo (FOIL)', 'Unai Simon', 'Robin Le Normand', 'Aymeric Laporte',
    'Dean Huijsen', 'Pedro Porro', 'Dani Carvajal', 'Marc Cucurella',
    'Martín Zubimendi', 'Rodri', 'Pedri', 'Fabian Ruiz',
    'Foto equipo', 'Mikel Merino', 'Lamine Yamal', 'Dani Olmo',
    'Nico Williams', 'Ferran Torres', 'Álvaro Morata', 'Mikel Oyarzabal',
  ]),
  teamSection('CPV', 'Cabo Verde', '🇨🇻', 'G', [
    'Escudo (FOIL)', 'Vozinha', 'Logan Costa', 'Pico',
    'Diney', 'Steven Moreira', 'Wagner Pina', 'Joao Paulo',
    'Yannick Semedo', 'Kevin Pina', 'Patrick Andrade', 'Jamiro Monteiro',
    'Foto equipo', 'Deroy Duarte', 'Garry Rodrigues', 'Jovane Cabral',
    'Ryan Mendes', 'Dailon Livramento', 'Willy Semedo', 'Bebe',
  ]),
  teamSection('KSA', 'Arabia Saudita', '🇸🇦', 'G', [
    'Escudo (FOIL)', 'Nawaf Alaqidi', 'Abdulrahman Al-Sanbi', 'Saud Abdulhamid',
    'Nawaf Bouwashl', 'Jihad Thakri', 'Moteb Al-Harbi', 'Hassan Altambakti',
    'Musab Aljuwayr', 'Ziyad Aljohani', 'Abdullah Alkhaibari', 'Nasser Aldawsari',
    'Foto equipo', 'Saleh Abu Alshamat', 'Marwan Alsahafi', 'Salem Aldawsari',
    'Abdulrahman Al-Aboud', 'Feras Akbrikan', 'Saleh Alshehri', 'Abdullah Al-Hamdan',
  ]),
  teamSection('URU', 'Uruguay', '🇺🇾', 'G', [
    'Escudo (FOIL)', 'Sergio Rochet', 'Santiago Mele', 'Ronald Araujo',
    'José María Giménez', 'Sebastian Caceres', 'Mathias Olivera', 'Guillermo Varela',
    'Nahitan Nandez', 'Federico Valverde', 'Giorgian De Arrascaeta', 'Rodrigo Bentancur',
    'Foto equipo', 'Manuel Ugarte', 'Nicolás de la Cruz', 'Maxi Araujo',
    'Darwin Núñez', 'Federico Viñas', 'Rodrigo Aguirre', 'Facundo Pellistri',
  ]),

  // ── GRUPO H ────────────────────────────────────────────────────
  teamSection('POR', 'Portugal', '🇵🇹', 'H', [
    'Escudo (FOIL)', 'Diogo Costa', 'Jose Sa', 'Ruben Dias',
    'João Cancelo', 'Diogo Dalot', 'Nuno Mendes', 'Gonçalo Inácio',
    'Bernardo Silva', 'Bruno Fernandes', 'Ruben Neves', 'Vitinha',
    'Foto equipo', 'João Neves', 'Cristiano Ronaldo', 'Francisco Trincao',
    'João Felix', 'Gonçalo Ramos', 'Pedro Neto', 'Rafael Leão',
  ]),
  teamSection('COD', 'Congo DR', '🇨🇩', 'H', [
    'Escudo (FOIL)', 'Lionel Mpasi', 'Aaron Wan-Bissaka', 'Axel Tuanzebe',
    'Arthur Masuaku', 'Chancel Mbemba', 'Joris Kayembe', 'Charles Pickel',
    'Ngal\'ayel Mukau', 'Edo Kayembe', 'Samuel Moutoussamy', 'Noah Sadiki',
    'Foto equipo', 'Théo Bongonda', 'Meschak Elia', 'Yoane Wissa',
    'Brian Cipenga', 'Fiston Mayele', 'Cédric Bakambu', 'Nathanaël Mbuku',
  ]),
  teamSection('UZB', 'Uzbekistán', '🇺🇿', 'H', [
    'Escudo (FOIL)', 'Utkir Yusupov', 'Farrukh Savfiev', 'Sherzod Nasrullaev',
    'Umar Eshmurodov', 'Husniddin Aliqulov', 'Rustamjon Ashurmatov', 'Khojiakbar Alijonov',
    'Abdukodir Khusanov', 'Odiljon Hamrobekov', 'Otabek Shukurov', 'Jamshid Iskanderov',
    'Foto equipo', 'Azizbek Turgunboev', 'Khojimat Erkinov', 'Eldor Shomurodov',
    'Oston Urunov', 'Jaloliddin Masharipov', 'Igor Sergeev', 'Abbosbek Fayzullaev',
  ]),
  teamSection('COL', 'Colombia', '🇨🇴', 'H', [
    'Escudo (FOIL)', 'Camilo Vargas', 'David Ospina', 'Dávinson Sánchez',
    'Yerry Mina', 'Daniel Munoz', 'Johan Mojica', 'Jhon Lucumí',
    'Santiago Arias', 'Jefferson Lerma', 'Kevin Castaño', 'Richard Rios',
    'Foto equipo', 'James Rodriguez', 'Juan Fernando Quintero', 'Jorge Carrascal',
    'Jon Arias', 'Jhon Cordova', 'Luis Suarez', 'Luis Diaz',
  ]),

  // ── GRUPO I ────────────────────────────────────────────────────
  teamSection('FRA', 'Francia', '🇫🇷', 'I', [
    'Escudo (FOIL)', 'Mike Maignan', 'Theo Hernandez', 'William Saliba',
    'Jules Kounde', 'Ibrahima Konate', 'Dayot Upamecano', 'Lucas Digne',
    'Aurélien Tchouaméni', 'Eduardo Camavinga', 'Manu Kone', 'Adrien Rabiot',
    'Foto equipo', 'Michael Olise', 'Ousmane Dembele', 'Bradley Barcola',
    'Désiré Doué', 'Kingsley Coman', 'Hugo Ekitike', 'Kylian Mbappe',
  ]),
  teamSection('SEN', 'Senegal', '🇸🇳', 'I', [
    'Escudo (FOIL)', 'Edouard Mendy', 'Yehvann Diouf', 'Moussa Niakhaté',
    'Abdoulaye Seck', 'Ismail Jakobs', 'El Hadji Malick Diouf', 'Kalidou Koulibaly',
    'Idrissa Gana Gueye', 'Pape Matar Sarr', 'Pape Gueye', 'Habib Diarra',
    'Foto equipo', 'Lamine Camara', 'Sadio Mane', 'Ismaïla Sarr',
    'Boulaye Dia', 'Iliman Ndiaye', 'Nicolas Jackson', 'Krepin Diatta',
  ]),
  teamSection('IRQ', 'Iraq', '🇮🇶', 'I', [
    'Escudo (FOIL)', 'Jalal Hassan', 'Rebin Sulaka', 'Hussein Ali',
    'Akam Hashem', 'Merchas Doski', 'Zaid Tahseen', 'Manaf Younis',
    'Zidane Iqbal', 'Amir Al-Ammari', 'Ibrahim Bavesh', 'Ali Jasim',
    'Foto equipo', 'Youssef Amyn', 'Aimar Sher', 'Marko Farji',
    'Osama Rashid', 'Ali Al-Hamadi', 'Aymen Hussein', 'Mohanad Ali',
  ]),
  teamSection('NOR', 'Noruega', '🇳🇴', 'I', [
    'Escudo (FOIL)', 'Orjan Nyland', 'Julian Ryerson', 'Leo Ostigård',
    'Kristoffer Vassbakk Ajer', 'Marcus Holmgren Pedersen', 'David Møller Wolfe', 'Torbjørn Heggem',
    'Morten Thorsby', 'Martin Ødegaard', 'Sander Berge', 'Andreas Schjelderup',
    'Foto equipo', 'Patrick Berg', 'Erling Haaland', 'Alexander Sørloth',
    'Aron Dønnum', 'Jorgen Strand Larsen', 'Antonio Nusa', 'Oscar Bobb',
  ]),

  // ── GRUPO J ────────────────────────────────────────────────────
  teamSection('ARG', 'Argentina', '🇦🇷', 'J', [
    'Escudo (FOIL)', 'Emiliano Martinez', 'Nahuel Molina', 'Cristian Romero',
    'Nicolas Otamendi', 'Nicolas Tagliafico', 'Leonardo Balerdi', 'Enzo Fernandez',
    'Alexis Mac Allister', 'Rodrigo De Paul', 'Exequiel Palacios', 'Leandro Paredes',
    'Foto equipo', 'Nico Paz', 'Franco Mastantuono', 'Nico Gonzalez',
    'Lionel Messi', 'Lautaro Martinez', 'Julian Alvarez', 'Giuliano Simeone',
  ]),
  teamSection('ALG', 'Argelia', '🇩🇿', 'J', [
    'Escudo (FOIL)', 'Alexis Guendouz', 'Ramy Bensebaini', 'Youcef Atal',
    'Rayan Aït-Nouri', 'Mohamed Amine Tougai', 'Aïssa Mandi', 'Ismael Bennacer',
    'Houssem Aquar', 'Hicham Boudaoui', 'Ramiz Zerrouki', 'Nabil Bentalab',
    'Foto equipo', 'Farés Chaibi', 'Riyad Mahrez', 'Said Benrahma',
    'Anis Hadj Moussa', 'Amine Gouiri', 'Baghdad Bounedjah', 'Mohammed Amoura',
  ]),
  teamSection('AUT', 'Austria', '🇦🇹', 'J', [
    'Escudo (FOIL)', 'Alexander Schlager', 'Patrick Pentz', 'David Alaba',
    'Kevin Danso', 'Philipp Lienhart', 'Stefan Posch', 'Phillipp Mwene',
    'Alexander Prass', 'Xaver Schlager', 'Marcel Sabitzer', 'Konrad Laimer',
    'Foto equipo', 'Florian Grillitsch', 'Nicolas Seiwald', 'Romano Schmid',
    'Patrick Wimmer', 'Christoph Baumgartner', 'Michael Gregoritsch', 'Marko Arnautović',
  ]),
  teamSection('JOR', 'Jordania', '🇯🇴', 'J', [
    'Escudo (FOIL)', 'Yazeed Abulaila', 'Ihsan Haddad', 'Mohammad Abu Hashish',
    'Yazan Al-Arab', 'Abdallah Nasib', 'Saleem Obaid', 'Mohammad Abualnadi',
    'Ibrahim Saadeh', 'Nizar Al-Rashdan', 'Noor Al-Rawabdeh', 'Mohannad Abu Taha',
    'Foto equipo', 'Amer Jamous', 'Musa Al-Taamari', 'Yazan Al-Naimat',
    'Mahmoud Al-Mardi', 'Ali Olwan', 'Mohammad Abu Zrayq', 'Ibrahim Sabra',
  ]),

  // ── GRUPO K ────────────────────────────────────────────────────
  teamSection('ENG', 'Inglaterra', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'K', [
    'Escudo (FOIL)', 'Jordan Pickford', 'John Stones', 'Marc Guéhi',
    'Ezri Konsa', 'Trent Alexander-Arnold', 'Reece James', 'Dan Burn',
    'Jordan Henderson', 'Declan Rice', 'Jude Bellingham', 'Cole Palmer',
    'Foto equipo', 'Morgan Rogers', 'Anthony Gordon', 'Phil Foden',
    'Bukayo Saka', 'Harry Kane', 'Marcus Rashford', 'Ollie Watkins',
  ]),
  teamSection('CRO', 'Croacia', '🇭🇷', 'K', [
    'Escudo (FOIL)', 'Dominik Livaković', 'Duje Caleta-Car', 'Josko Gvardiol',
    'Josip Stanišić', 'Luka Vušković', 'Josip Sutalo', 'Kristijan Jakic',
    'Luka Modrić', 'Mateo Kovacic', 'Martin Baturina', 'Lovro Majer',
    'Foto equipo', 'Mario Pasalic', 'Petar Sucic', 'Ivan Perišić',
    'Marco Pasalic', 'Ante Budimir', 'Andrej Kramarić', 'Franjo Ivanovic',
  ]),
  teamSection('GHA', 'Ghana', '🇬🇭', 'K', [
    'Escudo (FOIL)', 'Lawrence Ati Zigi', 'Tariq Lamptey', 'Mohammed Salisu',
    'Alidu Seidu', 'Alexander Djiku', 'Gideon Mensah', 'Caleb Yirenkyi',
    'Abdul Issahaku Fatawu', 'Thomas Partey', 'Salis Abdul Samed', 'Kamaldeen Sulemana',
    'Foto equipo', 'Mohammed Kudus', 'Inaki Williams', 'Jordan Ayew',
    'Andrew Ayew', 'Joseph Paintsil', 'Osman Bukari', 'Antoine Semenyo',
  ]),
  teamSection('PAN', 'Panamá', '🇵🇦', 'K', [
    'Escudo (FOIL)', 'Orlando Mosquera', 'Luis Mejia', 'Fidel Escobar',
    'Andres Andrade', 'Michael Amir Murillo', 'Eric Davis', 'Jose Cordoba',
    'Cesar Blackman', 'Cristian Martinez', 'Aníbal Godoy', 'Adalberto Carrasquilla',
    'Foto equipo', 'Édgar Bárcenas', 'Carlos Harvey', 'Ismael Díaz',
    'Jose Fajardo', 'Cecilio Waterman', 'Jose Luiz Rodriguez', 'Alberto Quintero',
  ]),

  // ── GRUPO L ────────────────────────────────────────────────────
  teamSection('SCO', 'Escocia', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'L', [
    'Escudo (FOIL)', 'Angus Gunn', 'Jack Hendry', 'Kieran Tierney',
    'Aaron Hickey', 'Andrew Robertson', 'Scott McKenna', 'John Souttar',
    'Anthony Ralston', 'Grant Hanley', 'Scott McTominay', 'Billy Gilmour',
    'Foto equipo', 'Lewis Ferguson', 'Ryan Christie', 'Kenny McLean',
    'John McGinn', 'Lyndon Dykes', 'Che Adams', 'Ben Gannon-Doak',
  ]),
  teamSection('BRA', 'Brasil', '🇧🇷', 'L', [
    'Escudo (FOIL)', 'Alisson', 'Bento', 'Marquinhos',
    'Éder Militão', 'Gabriel Magalhães', 'Danilo', 'Wesley',
    'Lucas Paquetá', 'Casemiro', 'Bruno Guimarães', 'Luiz Henrique',
    'Foto equipo', 'Vinicius Júnior', 'Rodrygo', 'João Pedro',
    'Matheus Cunha', 'Gabriel Martinelli', 'Raphinha', 'Estévão',
  ]),
  teamSection('HAI', 'Haití', '🇭🇹', 'L', [
    'Escudo (FOIL)', 'Johny Placide', 'Carlens Arcus', 'Martin Expérience',
    'Jean-Kevin Duverne', 'Ricardo Adé', 'Duke Lacroix', 'Garven Metusala',
    'Hannes Delcroix', 'Leverton Pierre', 'Danley Jean Jacques', 'Jean-Ricner Bellegarde',
    'Foto equipo', 'Christopher Attys', 'Derrick Etienne Jr', 'Josue Casimir',
    'Ruben Providence', 'Duckens Nazon', 'Louicius Deedson', 'Frantzdy Pierrot',
  ]),
  teamSection('MAR', 'Marruecos', '🇲🇦', 'L', [
    'Escudo (FOIL)', 'Yassine Bounou', 'Munir El Kajoui', 'Achraf Hakimi',
    'Noussair Mazraoui', 'Nayef Aguerd', 'Roman Saiss', 'Jawad El Yamio',
    'Adam Masina', 'Sofyan Amrabat', 'Azzedine Ounahi', 'Eliesse Ben Seghir',
    'Foto equipo', 'Bilal El Khannouss', 'Ismael Saibari', 'Youssef En-Nesyri',
    'Abde Ezzalzouli', 'Soufiane Rahimi', 'Brahim Diaz', 'Ayoub El Kaabi',
  ]),
];

export const ALL_STICKERS = SECTIONS.flatMap(s => s.stickers);
export const TOTAL_STICKERS = ALL_STICKERS.length;
