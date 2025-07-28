import { PrismaClient } from '@prisma/client';
import { RoleService } from '../services/role.service';

const prisma = new PrismaClient();
const roleService = new RoleService();

async function initializeCustomRoles() {
  try {
    console.log('🚀 Inizializzazione ruoli personalizzati...');

    const customRoles = [
      {
        name: 'superadmin',
        description: 'Super amministratore con tutti i permessi del sistema'
      },
      {
        name: 'admin',
        description: 'Amministratore con permessi di gestione avanzati'
      },
      {
        name: 'consultant',
        description: 'Consulente con accesso ai progetti e alle risorse'
      },
      {
        name: 'hr',
        description: 'Risorse Umane con accesso ai dati dei dipendenti'
      },
      {
        name: 'manager',
        description: 'Manager di progetto con permessi di gestione progetti'
      },
      {
        name: 'administration',
        description: 'Amministrazione con permessi di gestione operativa'
      },
      {
        name: 'segretary',
        description: 'Segretario con permessi di base e supporto'
      }
    ];

    console.log('📝 Creazione ruoli personalizzati...');
    
    for (const roleData of customRoles) {
      try {
        // Verifica se il ruolo esiste già
        const allRoles = await roleService.getAllRoles();
        const existingRole = allRoles.find((r: any) => r.name === roleData.name);
        
        if (existingRole) {
          console.log(`⚠️ Ruolo ${roleData.name} già esistente, saltato`);
        } else {
          // Crea il nuovo ruolo
          const newRole = await roleService.createRole(roleData);
          console.log(`✅ Creato ruolo: ${newRole.name} - ${newRole.description}`);
        }
      } catch (error) {
        console.error(`❌ Errore nella creazione del ruolo ${roleData.name}:`, error);
      }
    }

    console.log('🎉 Inizializzazione ruoli personalizzati completata!');
    
    // Mostra tutti i ruoli esistenti
    console.log('\n📋 Ruoli attualmente presenti nel sistema:');
    const allRoles = await roleService.getAllRoles();
    allRoles.forEach((role: any) => {
      console.log(`  - ${role.name}: ${role.description}`);
    });

  } catch (error) {
    console.error('❌ Errore durante l\'inizializzazione dei ruoli personalizzati:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Esegui lo script se chiamato direttamente
if (require.main === module) {
  initializeCustomRoles()
    .then(() => {
      console.log('✅ Script completato con successo');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script fallito:', error);
      process.exit(1);
    });
}

export { initializeCustomRoles }; 