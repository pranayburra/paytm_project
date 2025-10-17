import {db} from "@repo/db"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import { JWT } from "next-auth/jwt";
import NextAuth, { Session } from "next-auth";

export const authOptions = {
    providers: [
      CredentialsProvider({
          name: 'Credentials',
          credentials: {
            phone: { label: "Phone number", type: "text", placeholder: "1231231231" },
            password: { label: "Password", type: "password" }
          },
          // TODO: User credentials type from next-aut
          async authorize(credentials) {
           if(!credentials?.password|| !credentials?.phone)return null;
            // Do zod validation, OTP validation here
            const {phone,password}=credentials as{
              phone:string;
              password:string;
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const existingUser = await db.user.findFirst({
                where: {
                    number: credentials.phone
                }
            });

            if (existingUser) {
               
                const passwordValidation = await bcrypt.compare(password, existingUser.password);
                if (passwordValidation) {
                    return {
                        id: existingUser.id.toString(),
                        name: existingUser.number,
                   
                    }
                }
                return null;
            }

            try {
                const user = await db.user.create({
                    data: {
                        number: phone,
                        password: hashedPassword
                    }
                });
            
                return {
                    id: user.id.toString(),
                    number: user.number
                }
            } catch(e) {
                console.error(e);
            }

            return null
          },
        })
    ],
    secret: process.env.AUTH_SECRET ,
    callbacks: {
        // TODO: can u fix the type here? Using any is bad
        async session({ token, session }: {token:JWT;session:Session}) {
            if(session.user){
                 session.user.id = token.sub
            }
           

            return session
        }
    }
  }
 
 
export const { handlers, signIn, signOut, auth } =NextAuth(authOptions);