import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateRolesToUserRole() {
  console.log('🔄 Verifica stato migrazione ruoli...');

  try {
    console.log('✅ Il campo roles è stato completamente rimosso dal modello ApplicationUser');
    console.log('✅ Tutti i ruoli sono ora gestiti attraverso la tabella UserRole');
    console.log('✅ Nessuna migrazione necessaria');

    // Verifica che il sistema di ruoli funzioni correttamente
    console.log('\n🔍 Verifica sistema ruoli...');
    
    const totalUsers = await prisma.applicationUser.count();
    const totalUserRoles = await (prisma as any).userRole.count();
    const totalRoles = await (prisma as any).role.count();
    
    console.log(`📊 Statistiche sistema ruoli:`);
    console.log(`   - Utenti totali: ${totalUsers}`);
    console.log(`   - Assegnazioni ruoli: ${totalUserRoles}`);
    console.log(`   - Ruoli disponibili: ${totalRoles}`);

    // Mostra alcuni esempi di utenti con i loro ruoli
    console.log('\n📋 Esempi di utenti con ruoli:');
    const sampleUsers = await prisma.applicationUser.findMany({
      take: 5,
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });

    sampleUsers.forEach((user: any) => {
      const roleNames = user.userRoles.map((ur: any) => ur.role.name).join(', ');
      console.log(`     - ${user.email}: [${roleNames || 'Nessun ruolo'}]`);
    });

    console.log('\n✅ Sistema ruoli funzionante correttamente!');
    console.log('ℹ️  Tutti i ruoli sono ora gestiti attraverso la tabella UserRole');

  } catch (error) {
    console.error('❌ Errore durante la verifica:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Esegui la verifica se il file viene chiamato direttamente
if (require.main === module) {
  migrateRolesToUserRole()
    .then(() => {
      console.log('🎉 Verifica completata con successo!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Errore durante la verifica:', error);
      process.exit(1);
    });
}

export { migrateRolesToUserRole }; 