import {prisma} from "@/lib/prisma";
import {Role} from "@/prisma/generated";

export async function seedAccount() {
    try {
        await prisma.user.create({
            data: {
                id: "superman",
                name: "Superman",
                email: "admin@votty.id",
                emailVerified: true,
                role: Role.ADMIN,
                accounts: {
                    create: {
                        id: "admin",
                        accountId: "superman",
                        providerId: "credential",
                        accessToken: null,
                        refreshToken: null,
                        idToken: null,
                        accessTokenExpiresAt: null,
                        refreshTokenExpiresAt: null,
                        scope: null,
                        password:
                            "cf88dd76e78a98dce0c042b1f1ef5017:545168bc43fad0f55b01da206f5c7414a35b3206664eb9f4273c6d9e35c3afccc55ca67fa35f7bbd1709659126dd57d0292899ab76cf6ad78758e3d73fb5dbea",
                    },
                },
            },
        });
    } catch (error) {
        console.error(error);
    }
}
