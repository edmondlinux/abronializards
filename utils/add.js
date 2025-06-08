import connectDB from '../config/db.js';
import Post from '../models/Post.js';

// Sample fake user data
const fakeUsers = [
    {
        "userId": "gonsalez",
        "name": " Raul Gonzalez",
        "imageUrl": "https://randomuser.me/api/portraits/men/31.jpg"
    },
    {
        "userId": "amelia_jones",
        "name": "Amelia Jones",
        "imageUrl": "https://randomuser.me/api/portraits/women/45.jpg"
    },
    {
        "userId": "nathan_williams",
        "name": "Nathan Williams",
        "imageUrl": "https://randomuser.me/api/portraits/men/54.jpg"
    },
    {
        "userId": "sofia_conti",
        "name": "Sofia Conti",
        "imageUrl": "https://randomuser.me/api/portraits/women/21.jpg"
    },
    {
        "userId": "hugo_dubois",
        "name": "Hugo Dubois",
        "imageUrl": "https://randomuser.me/api/portraits/men/17.jpg"
    },
    {
        "userId": "emily_clarke",
        "name": "Emily Clarke",
        "imageUrl": "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
        "userId": "tobias_nielsen",
        "name": "Tobias Nielsen",
        "imageUrl": "https://randomuser.me/api/portraits/men/3.jpg"
    },
    {
        "userId": "isla_murphy",
        "name": "Isla Murphy",
        "imageUrl": "https://randomuser.me/api/portraits/women/28.jpg"
    },
    {
        "userId": "mateo_fernandez",
        "name": "Mateo Fernandez",
        "imageUrl": "https://randomuser.me/api/portraits/men/23.jpg"
    },
    {
        "userId": "zoe_fischer",
        "name": "Zoe Fischer",
        "imageUrl": "https://randomuser.me/api/portraits/women/39.jpg"
    },
    {
        "userId": "leon_martin",
        "name": "Leon Martin",
        "imageUrl": "https://randomuser.me/api/portraits/men/38.jpg"
    },
    {
        "userId": "freya_brown",
        "name": "Freya Brown",
        "imageUrl": "https://randomuser.me/api/portraits/women/13.jpg"
    },
    {
        "userId": "noah_evans",
        "name": "Noah Evans",
        "imageUrl": "https://randomuser.me/api/portraits/men/10.jpg"
    },
    {
        "userId": "mia_kowalski",
        "name": "Mia Kowalski",
        "imageUrl": "https://randomuser.me/api/portraits/women/55.jpg"
    },
    {
        "userId": "oliver_svensson",
        "name": "Oliver Svensson",
        "imageUrl": "https://randomuser.me/api/portraits/men/33.jpg"
    },
    {
        "userId": "eva_keller",
        "name": "Eva Keller",
        "imageUrl": "https://randomuser.me/api/portraits/women/60.jpg"
    },
    {
        "userId": "ethan_roberts",
        "name": "Ethan Roberts",
        "imageUrl": "https://randomuser.me/api/portraits/men/41.jpg"
    },
    {
        "userId": "sienna_hughes",
        "name": "Sienna Hughes",
        "imageUrl": "https://randomuser.me/api/portraits/women/7.jpg"
    },
    {
        "userId": "benjamin_koch",
        "name": "Benjamin Koch",
        "imageUrl": "https://randomuser.me/api/portraits/men/29.jpg"
    },
    {
        "userId": "elena_gruber",
        "name": "Elena Gruber",
        "imageUrl": "https://randomuser.me/api/portraits/women/46.jpg"
    }
];

// Realistic user-specific posts with mix of content types and languages
const userPosts = [
    {
        // Raul Gonzalez - Spanish breeder with expertise (Spain/Mexico)
        userId: 'gonsalez',
        posts: [
            {
    post: "Abronia taeniata\nCB '23 – Not for Sale\n\nJust sharing some updated shots of one of my holdbacks from my 2023 clutch. This is Abronia taeniata, a species I’ve been fortunate to work with for several years now. Still one of my favorites — that bold banding and iridescent sheen in the right light is just unmatched.\n\nSetup:\n- Enclosure: Custom-built 24x18x36 bioactive\n- Temps: Daytime 70–75°F / Night drop to mid-60s\n- Humidity: 70–90%, misted twice daily\n- Ventilation: High  don’t skimp on airflow\n- Lighting: Full-spectrum UVB (Arcadia 6%) plus LED plant lighting\n\nDiet:\n- Primarily gut-loaded dubia and lateralis roaches\n- Occasional hornworms and silkworms\n- Dusted with Repashy Calcium Plus twice a week\n\nNotes:\nAbronia taeniata is not a beginner species. They stress easily and are sensitive to poor husbandry — especially stagnant air and high temps. Always prioritize clean, fresh airflow and avoid overheating. If you're not comfortable keeping montane species, hold off.\n\nThis individual has been solid — eating well, active at dawn and dusk, and already displaying good color and personality. Hoping to pair her in 2026 depending on development.\n\nHappy to connect with other Abronia keepers — feel free to message me if you're working with the species or want to chat care.\n\nTags: abronia taeniata, alligator lizard, montane species, reptile keeping, herp hobby, abronia, rare reptiles, bioactive enclosure",
    image: "https://live.staticflickr.com/6226/6314399554_5847ddfe03_b.jpg"
}
,
          {
    post: "Abronia graminea\nCB '22 Male – Not Available\n\nJust a quick update on one of my adult males. This guy has really colored up over the past few months — that turquoise is finally coming through strong under proper UV and diet.\n\nSetup:\n- Enclosure: 18x18x36 Exo Terra, live planted\n- Temps: 68–74°F daytime / drops to 60°F at night\n- Humidity: 80%+ with daily misting\n- Lighting: Arcadia T5 UVB 6% + jungle dawn LED bar\n\nFeeding:\n- Main staples: Dubia, red runners, and BSFL\n- Occasional: Waxworms, hornworms\n- Supplemented with calcium/D3 every other feeding\n\nTemperament:\nFairly calm for a graminea. He still prefers minimal handling, but not overly skittish. I only interact during feeding/maintenance to minimize stress.\n\nNotes:\nThis species does best in a cool, well-ventilated, and humid environment. Avoid stagnant setups — they need good air exchange. I've found deep leaf litter and vertical cork bark really help with security.\n\nAlways open to talk shop with other Abronia folks. Feel free to share setups or tips!\n\nTags: abronia graminea, arboreal lizard, montane reptile, CB22, reptile bioactive, UVB husbandry, rare reptiles, alligator lizard",
    image: "https://live.staticflickr.com/5630/29932734322_89c2b30ba2_z.jpg"
}
,
            {
                post: "Pair Abronia Graminea lizards they are fire 🔥",
                image: 'https://live.staticflickr.com/3420/3879275867_f987eab8c3_k.jpg'
            }
        ]
    },
    {
        // Amelia Jones - Experienced UK keeper, helpful expert
        userId: 'amelia_jones',
        posts: [
            {
                post: "Friendly reminder that Abronia are NOT beginner reptiles despite what some shops say. They need consistent high humidity (80-90%), specific temperatures, and quality food. Please research properly before buying! 💚",
                image: null
            },
            {
                post: "My breeding pair just had their 4th successful clutch this year! These babies will be ready in about 8 weeks. All captive bred from proven bloodlines. UK only.",
                image: 'https://live.staticflickr.com/3420/3879275867_f987eab8c3_k.jpg'
            }
        ]
    },
    {
        // Nathan Williams - Casual hobbyist from US
        userId: 'nathan_williams',
        posts: [
            {
                post: "Finally found some quality dubia roaches for my Abronia! The difference in their activity level is incredible. They're actually hunting now instead of just sitting there.",
                image: null
            },
            {
                post: "Two years with my Abronia and still amazed by how intelligent they are. Mine recognizes feeding time and actually comes to the front of the enclosure. Such amazing animals! 🦎💪",
                image: "https://live.staticflickr.com/6229/6314416816_17fff4161b_b.jpg"
            }
        ]
    },
    {
        // Sofia Conti - Italian keeper with good experience  
        userId: 'sofia_conti',
        posts: [
            {
                post: "Le mie Abronia adorano i lombrichi! Ho iniziato ad allevarli io stessa per avere sempre cibo fresco. È incredibile quanto siano attive ora rispetto a quando usavo solo grilli.",
                image: null
            },
            {
                post: "Perfetto setup per A. graminea: terrario 120x60x90, molte piante vive (pothos e ficus), nebulizzatore automatico ogni 4 ore. Risultato: animali super attivi e colorati! 🌿",
                image: 'https://instagram.fnsi1-2.fna.fbcdn.net/v/t39.30808-6/449779791_17985368348690419_4381334144645456940_n.jpg'
            }
        ]
    },
    {
        // Hugo Dubois - French breeder, expert level
        userId: 'hugo_dubois',
        posts: [
            {
                post: "Après 15 ans d'élevage d'Abronia, je peux confirmer que la génétique des lignées européennes est excellente. Mes reproducteurs donnent des jeunes très robustes avec 95% de taux de survie.",
                image: null
            },
            {
                post: "Important: Les UVB ne sont PAS optionnels pour les Abronia! J'utilise du 5% UVB avec un cycle jour/nuit de 12h. Résultat: meilleure digestion, couleurs plus vives, comportement naturel.",
                image: null
            },
            {
                post: "Mes bébés A. graminea de la saison 2024 sont disponibles! Tous nés en captivité, parents visibles, documentation complète. France et Europe uniquement. DM pour infos 🦎",
                image: null
            }
        ]
    },
    {
        // Emily Clarke - Experienced keeper from UK
        userId: 'emily_clarke',
        posts: [
            {
                post: "PSA: Stop feeding your Abronia mealworms as a staple! They're fatty and addictive. Use crickets, roaches, and waxworms as treats. Your lizards will be much healthier.",
                image: null
            },
            {
                post: "My female just laid her first clutch at 3 years old. Perfectly formed eggs! Sometimes patience really pays off in this hobby. Now the waiting game begins... 🥚",
                image: null
            }
        ]
    },
    {
        // Tobias Nielsen - Danish keeper, tech-savvy
        userId: 'tobias_nielsen',
        posts: [
            {
                post: "Jeg har installeret automatisk tågesystem med Arduino controller. Fugtighed holdes perfekt på 85% hele tiden. Mine Abronia har aldrig været mere aktive! Kan dele koden hvis nogen er interesseret.",
                image: null
            },
            {
                post: "Årlig veterinær check på alle mine Abronia i dag. Alle sunde! Hvis I holder disse dyr, find en eksotisk dyrlæge FØR I har brug for en. Forebyggelse er alt.",
                image: null
            }
        ]
    },
    {
        // Isla Murphy - Irish keeper, plant enthusiast
        userId: 'isla_murphy',
        posts: [
            {
                post: "The live plant setup in my Abronia enclosure is thriving! Pothos, bromeliads, and small ferns create perfect microclimates. The lizards love basking on the broad leaves. Nature knows best! 🌱",
                image: null
            }
        ]
    },
    {
        // Mateo Fernandez - Spanish keeper from Latin America
        userId: 'mateo_fernandez',
        posts: [
            {
                post: "Aquí en Colombia tenemos la fortuna de ver Abronia en su hábitat natural. Por favor, NO las capturen! La cría en cautiverio es suficiente y necesaria para conservar las especies.",
                image: null
            },
            {
                post: "Mi macho A. graminea acaba de cumplir 8 años - récord personal! Alimentación variada, ambiente estable y mucho respeto por su espacio. Son animales para toda la vida 💚",
                image: null
            }
        ]
    },
    {
        // Zoe Fischer - German breeder
        userId: 'zoe_fischer',
        posts: [
            {
                post: "Meine Abronia-Zucht läuft seit 5 Jahren perfekt. Geheimnis: Konstante Parameter, niemals Kompromisse bei der Qualität des Futters, und viel Geduld. 18 gesunde Jungtiere dieses Jahr! 🦎",
                image: null
            },
            {
                post: "Warnung vor billigen Importen! Gestern wieder kranke Tiere beim Händler gesehen. Kauft nur bei seriösen Züchtern mit Nachweis der Herkunft. Eure Geldbörse und die Tiere werden es danken.",
                image: null
            }
        ]
    },
    {
        // Leon Martin - French keeper
        userId: 'leon_martin',
        posts: [
            {
                post: "Mes A. graminea mangent enfin des escargots! Ça a pris 6 mois pour les habituer mais maintenant elles adorent. Excellente source de calcium naturel pour les femelles reproductrices.",
                image: null
            }
        ]
    },
    {
        // Freya Brown - UK keeper, conservation focused
        userId: 'freya_brown',
        posts: [
            {
                post: "Reminder that every captive bred Abronia is a victory for conservation! Wild populations are under pressure. Let's keep breeding responsibly and sharing knowledge. These species need us! 🌍",
                image: null
            }
        ]
    },
    {
        // Noah Evans - Experienced US keeper
        userId: 'noah_evans',
        posts: [
            {
                post: "After years of keeping Abronia, I can tell you the biggest mistake is overhandling. These are display animals, not pets to cuddle. Respect their nature and they'll thrive for you. 🦎",
                image: null
            },
            {
                post: "Just upgraded to a custom bioactive setup for my breeding group. 6 months of planning but watching them behave naturally is worth every penny and hour invested.",
                image: null
            }
        ]
    },
    {
        // Mia Kowalski - Polish keeper  
        userId: 'mia_kowalski',
        posts: [
            {
                post: "Moje Abronia graminea właśnie przeszły przez udaną hibernację! 12 tygodni w temperaturze 16-18°C. Teraz są super aktywne i gotowe do rozrodu. Polski klimat pomaga w naturalnym cyklu!",
                image: null
            }
        ]
    },
    {
        // Oliver Svensson - Swedish breeder
        userId: 'oliver_svensson',
        posts: [
            {
                post: "Svensk Abronia-uppfödning går fantastiskt! Mina honor har lagt över 40 ägg denna säsong. Alla från bevisade CB-linjer. Kontakta mig för väntelista - kvalitet före kvantitet alltid!",
                image: null
            },
            {
                post: "Vinterljuscykeln i Sverige är perfekt för Abronia-avel. Naturlig nedkylning november-februari, sedan aktiv parningstid mars-oktober. Naturen vet bäst! ❄️➡️🌞",
                image: null
            }
        ]
    },
    {
        // Eva Keller - German expert
        userId: 'eva_keller',
        posts: [
            {
                post: "Nach 12 Jahren Abronia-Haltung: Die größten Fehler sind zu kleine Terrarien und falsche Luftfeuchtigkeit. Mindestens 120x60x90cm für ein Paar, 80-90% Luftfeuchte IMMER!",
                image: null
            }
        ]
    },
    {
        // Ethan Roberts - Canadian keeper
        userId: 'ethan_roberts',
        posts: [
            {
                post: "Canadian winter is perfect for Abronia brumation! My basement stays naturally cool (18-20°C) from November to March. Result: healthy animals and successful breeding every spring! 🍁",
                image: null
            }
        ]
    },
    {
        // Sienna Hughes - Welsh keeper
        userId: 'sienna_hughes',
        posts: [
            {
                post: "Welsh weather = perfect Abronia weather! Natural humidity and cool temperatures mean lower electricity bills and happier lizards. Sometimes climate change has unexpected benefits! 🏴󠁧󠁢󠁷󠁬󠁳󠁿",
                image: null
            }
        ]
    },
    {
        // Benjamin Koch - German hobbyist
        userId: 'benjamin_koch',
        posts: [
            {
                post: "Meine erste erfolgreiche Abronia-Häutung miterlebt! Faszinierend wie vorsichtig sie dabei vorgehen. 3 Stunden Geduld haben sich gelohnt. Diese Tiere sind einfach unglaublich! 🔄",
                image: null
            }
        ]
    },
    {
        // Elena Gruber - Austrian breeder
        userId: 'elena_gruber',
        posts: [
            {
                post: "Österreichische Abronia-Zucht 2024: 23 gesunde Jungtiere von 3 Paaren! Alle Elterntiere aus dokumentierten CB-Linjen seit 2019. Warteliste für 2025 ist bereits offen. Qualität braucht Zeit! 🇦🇹",
                image: null
            },
            {
                post: "Tipps für Anfänger: Beginnt mit A. graminea - robusteste Art. Kauft nur CB-Tiere mit Herkunftsnachweis. Plant mindestens 2000€ für komplettes Setup. Nicht billig, aber es lohnt sich!",
                image: null
            }
        ]
    }
];

async function addRealisticMultilingualPosts() {
    try {
        console.log('🔌 Connecting to database...');
        await connectDB();

        console.log('🌍 Creating realistic multilingual community posts...');

        const createdPosts = [];
        let totalPostsCreated = 0;

        // Create posts for each user
        for (const userData of userPosts) {
            const user = fakeUsers.find(u => u.userId === userData.userId);
            if (!user) {
                console.log(`❌ User not found: ${userData.userId}`);
                continue;
            }

            console.log(`\n👤 Creating posts for ${user.name}...`);

            for (let postIndex = 0; postIndex < userData.posts.length; postIndex++) {
                const postData = userData.posts[postIndex];

                // Determine likes range
                let likesRange;
                if (userData.userId === 'gonsalez' || userData.userId === 'hugo_dubois' || userData.userId === 'zoe_fischer') {
                    likesRange = { min: 15, max: 80 };
                } else if (postData.post.length > 100) {
                    likesRange = { min: 25, max: 50 };
                } else {
                    likesRange = { min: 10, max: 30 };
                }

                const randomLikes = Math.floor(Math.random() * (likesRange.max - likesRange.min + 1)) + likesRange.min;

                // Generate likedBy array
                const likedBy = [];
                for (let j = 0; j < randomLikes; j++) {
                    likedBy.push(`user_${j}_${Math.random().toString(36).substr(2, 5)}`);
                }

                // Generate realistic post date (between 7 and 45+ days ago)
                const minDaysAgo = 7;
                const maxDaysAgo = 45;
                const randomDaysAgo = Math.floor(Math.random() * (maxDaysAgo - minDaysAgo + 1)) + minDaysAgo;
                const randomHoursAgo = Math.floor(Math.random() * 24);
                const randomMinutesAgo = Math.floor(Math.random() * 60);

                const createdAt = new Date();
                createdAt.setDate(createdAt.getDate() - randomDaysAgo);
                createdAt.setHours(createdAt.getHours() - randomHoursAgo);
                createdAt.setMinutes(createdAt.getMinutes() - randomMinutesAgo);

                const newPost = {
                    content: postData.post,
                    image: postData.image || '',
                    author: {
                        userId: user.userId,
                        name: user.name,
                        imageUrl: user.imageUrl
                    },
                    likes: randomLikes,
                    likedBy: likedBy,
                    commentCount: Math.floor(randomLikes / 8),
                    createdAt: createdAt,
                    updatedAt: createdAt
                };

                const createdPost = await Post.create(newPost);
                createdPosts.push(createdPost);
                totalPostsCreated++;

                console.log(`   ✅ Created post: "${postData.post.substring(0, 50)}..." with ${randomLikes} likes`);
            }
        }

        console.log('\n🎉 Successfully created realistic multilingual community posts!');
        console.log('\n📊 Summary by User & Language:');

        for (const userData of userPosts) {
            const user = fakeUsers.find(u => u.userId === userData.userId);
            if (user) {
                const languages = new Set();
                userData.posts.forEach(post => {
                    if (post.post.match(/[àáâãäåæçèéêëìíîïñòóôõöøùúûüý]|hijo|después|años|está|habituar/i)) {
                        languages.add('🇪🇸 Spanish');
                    } else if (post.post.match(/après|élevage|sont|avec|mes|des|une|température/i)) {
                        languages.add('🇫🇷 French'); 
                    } else if (post.post.match(/meine|nach|sind|mit|für|der|das|über|können/i)) {
                        languages.add('🇩🇪 German');
                    } else if (post.post.match(/mine|moja|właśnie|przez|temperatura|aktywne/i)) {
                        languages.add('🇵🇱 Polish');
                    } else if (post.post.match(/mina|efter|svenska|fantastiskt|bäst|alltid/i)) {
                        languages.add('🇸🇪 Swedish');
                    } else if (post.post.match(/jeg|har|med|alle|mine|være/i)) {
                        languages.add('🇩🇰 Danish');
                    } else if (post.post.match(/le|della|sono|molto|con|per|dopo/i)) {
                        languages.add('🇮🇹 Italian');
                    } else {
                        languages.add('🇬🇧 English');
                    }
                });

                console.log(`\n👤 ${user.name} (${user.userId}):`);
                console.log(`   🗣️  Languages: ${Array.from(languages).join(', ')}`);
                console.log(`   📝 ${userData.posts.length} posts created`);

                userData.posts.forEach((post, idx) => {
                    const preview = post.post.substring(0, 60);
                    console.log(`   ${idx + 1}. "${preview}..."`);
                });
            }
        }

        const totalPosts = await Post.countDocuments();
        console.log(`\n📈 Total posts in database: ${totalPosts}`);
        console.log(`🆕 Posts created in this run: ${totalPostsCreated}`);
        console.log(`\n🌍 Languages represented: Spanish, French, German, Italian, Polish, Swedish, Danish, English`);
        console.log(`👥 User types: Expert breeders, experienced keepers, hobbyists, conservation advocates`);

    } catch (error) {
        console.error('❌ Error creating realistic posts:', error);
    } finally {
        process.exit(0);
    }
}

// Run the script
addRealisticMultilingualPosts();




Handling blog post directly from coding is giving me a hard time so I was looking for a way which we could integrate something like a headless cms that will work along site with the traditional method which use to add post, but idk how I can do this, where I can still customize everything like meta data and all other content but still having it delivered at the blog of my website with all existing display is that possible?
And can you tell me how we can do this ? i have already install sanity,created aproject and sellected some things on the cli i shall provide the complete log , now i just need help with the next steps to follow thansk 