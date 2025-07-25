import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateRolesToUserRole() {
  console.log('🔄 Iniziando migrazione ruoli dal campo roles alla tabella UserRole...');

  try {
    // 1. Trova tutti gli utenti che hanno ruoli nel campo roles
    const usersWithRoles = await prisma.applicationUser.findMany({
      where: {
        roles: {
          isEmpty: false
        }
      },
      select: {
        id: true,
        email: true,
        roles: true
      }
    });

    console.log(`📊 Trovati ${usersWithRoles.length} utenti con ruoli nel campo roles`);

    if (usersWithRoles.length === 0) {
      console.log('✅ Nessun utente da migrare');
      return;
    }

    // 2. Ottieni tutti i ruoli disponibili
    const allRoles = await (prisma as any).role.findMany({
      select: {
        id: true,
        name: true
      }
    });

    const roleMap = new Map(allRoles.map((role: any) => [role.name, role.id]));
    console.log(`📋 Ruoli disponibili: ${allRoles.map((r: any) => r.name).join(', ')}`);

    let migratedCount = 0;
    let skippedCount = 0;

    // 3. Per ogni utente, crea i record nella tabella UserRole
    for (const user of usersWithRoles) {
      console.log(`\n👤 Migrazione utente: ${user.email} (${user.id})`);
      console.log(`   Ruoli nel campo roles: [${user.roles.join(', ')}]`);

      for (const roleName of user.roles) {
        const roleId = roleMap.get(roleName);
        
        if (!roleId) {
          console.log(`   ⚠️  Ruolo '${roleName}' non trovato nella tabella Role - saltato`);
          skippedCount++;
          continue;
        }

        try {
          // Controlla se il record esiste già
          const existingUserRole = await (prisma as any).userRole.findUnique({
            where: {
              userId_roleId: {
                userId: user.id,
                roleId: roleId
              }
            }
          });

          if (existingUserRole) {
            console.log(`   ℹ️  Ruolo '${roleName}' già assegnato - saltato`);
            skippedCount++;
            continue;
          }

          // Crea il record UserRole
          await (prisma as any).userRole.create({
            data: {
              userId: user.id,
              roleId: roleId,
              assignedBy: null,
              assignedAt: new Date(),
              isActive: true
            }
          });

          console.log(`   ✅ Ruolo '${roleName}' assegnato con successo`);
          migratedCount++;

        } catch (error) {
          console.error(`   ❌ Errore nell'assegnazione del ruolo '${roleName}':`, error);
        }
      }
    }

    // 4. Pulisci il campo roles (opzionale - commentato per sicurezza)
    console.log('\n🧹 Pulizia del campo roles...');
    
    // UNCOMMENT LA RIGA SOTTO PER PULIRE IL CAMPO ROLES
    // await prisma.applicationUser.updateMany({
    //   where: {
    //     roles: {
    //       isEmpty: false
    //     }
    //   },
    //   data: {
    //     roles: []
    //   }
    // });

    console.log('⚠️  Pulizia del campo roles COMMENTATA per sicurezza');
    console.log('   Per pulire il campo roles, decommentare le righe nel codice');

    // 5. Riepilogo
    console.log('\n📈 Riepilogo migrazione:');
    console.log(`   - Utenti processati: ${usersWithRoles.length}`);
    console.log(`   - Ruoli migrati: ${migratedCount}`);
    console.log(`   - Ruoli saltati: ${skippedCount}`);
    console.log(`   - Utenti con ruoli nel campo roles: ${usersWithRoles.length}`);

    // 6. Verifica finale
    console.log('\n🔍 Verifica finale...');
    const usersWithRolesAfter = await prisma.applicationUser.findMany({
      where: {
        roles: {
          isEmpty: false
        }
      },
      select: {
        id: true,
        email: true,
        roles: true
      }
    });

    console.log(`   Utenti ancora con ruoli nel campo roles: ${usersWithRolesAfter.length}`);

    if (usersWithRolesAfter.length > 0) {
      console.log('   Utenti con ruoli nel campo roles:');
      usersWithRolesAfter.forEach(user => {
        console.log(`     - ${user.email}: [${user.roles.join(', ')}]`);
      });
    }

    console.log('\n✅ Migrazione completata!');

  } catch (error) {
    console.error('❌ Errore durante la migrazione:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Esegui la migrazione se il file viene chiamato direttamente
if (require.main === module) {
  migrateRolesToUserRole()
    .then(() => {
      console.log('🎉 Migrazione completata con successo!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Errore durante la migrazione:', error);
      process.exit(1);
    });
}

export { migrateRolesToUserRole }; 