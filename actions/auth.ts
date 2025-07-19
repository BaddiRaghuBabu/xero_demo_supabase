'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import {headers} from "next/headers"

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const credentials={
    username:formData.get("username") as string,
    email:formData.get("email") as string,
    password:formData.get("password") as string,
  };

  const { error,data } = await supabase.auth.signUp({
    email:credentials.email,
    password:credentials.password,
    options:{
        data:{
            username:credentials.username,
        },
    },
  });

  if (error) {
    return {
        status:error?.message,
        user:null
    };
  } else if (data?.user?.identities?.length==0){
   return {
    status:"user already exist please login",
    user:null
   };
  }

  revalidatePath('/', 'layout')
  return {status:"success",user:data.user};
}


export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;



  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      status: error.message,
      user: null,
    };
  }


  // Check if the user already exists in user_profiles table
  const Credentials = {
  email
};
  const { data: existingUser } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("email", Credentials?.email)
    .limit(1) // to avoid multiple rows
    .single();

  if (!existingUser) {
    const {error:insertError}=await supabase.from("user_profiles").insert({
        email:data?.user?.email,
        username:data?.user?.user_metadata?.username,
    
    });
    if (insertError) {
      return {
        status: insertError.message,
        user: null,
      };
    } else {
      console.log("User inserted into user_profiles successfully.");
    }
  }

  return {
    status: "success",
    user: data.user,
  };
}



// actions/auth.ts
export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout error:", error.message);
    throw new Error("Logout failed: " + error.message);
  }

  // Optional: revalidatePath("/", "layout"); — only if needed
}


// Get current user session
export async function getUserSession() {
  const supabase = createClient();

  // Correct method: getSession()
  const { data, error } = await (await supabase).auth.getUser();
  if (error) {
    return null;
  }

  return {
    status: "success",
    user: data?.user, // May still be null if not logged in
  };
}

// Github Login Auth
export async function signInWithGithub() {
  const origin=((await headers()).get("origin"));
  const supabase=await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
  provider:'github',
  options:{
    redirectTo:`${origin}/auth/callback`,
  },


  });
    if (error) {
    redirect("/");
    
  }else if (data.url){
    return redirect(data.url);
  }
}


//google auth 
export async function signInWithGoogle() {
  const origin=((await headers()).get("origin"));
  const supabase=await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
  provider:'google',
  options:{
    redirectTo:`${origin}/auth/callback`,
  },


  });
    if (error) {
    redirect("/");
    
  }else if (data.url){
    return redirect(data.url);
  }
}


// ForgotPassword
export async function forgotPassword(formData: FormData) {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.resetPasswordForEmail(
    formData.get("email") as string,
    {
      redirectTo: `${origin}/reset-password`,
    }
  );

  if (error) {
    return {
      status: error.message,
    };
  }

  return {
    status: "success",
  };
}

//reset password
export async function resetPassword(formData: FormData, code: string) {
  const supabase = await createClient();
  const { error: CodeError } = await supabase.auth.exchangeCodeForSession(code);

  if (CodeError) {
    return { status: CodeError?.message };
  }

  const { error } = await supabase.auth.updateUser({
    password: formData.get("password") as string,
  });

  if (error) {
    return { status: error?.message };
  }

  return { status: "success" };
}

