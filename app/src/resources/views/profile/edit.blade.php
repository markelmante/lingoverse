<x-app-layout>
    
    <div class="py-12">
        <div class="max-w-3xl mx-auto sm:px-6 lg:px-8 space-y-6"> 
            
            <div class="p-6 shadow-xl sm:rounded-lg" style="background-color: var(--color-blanco); border-radius: 10px; margin-bottom: 1.5rem;"> 
                <div class="max-w-xl">
                    @include('profile.partials.update-profile-information-form')
                </div>
            </div>

            <div class="p-6 shadow-xl sm:rounded-lg" style="background-color: var(--color-blanco); border-radius: 10px; margin-bottom: 1.5rem;">
                <div class="max-w-xl">
                    @include('profile.partials.update-password-form')
                </div>
            </div>

            <div class="p-6 shadow-xl sm:rounded-lg" style="background-color: var(--color-blanco); border-radius: 10px;">
                <div class="max-w-xl">
                    @include('profile.partials.delete-user-form')
                </div>
            </div>
        </div>
    </div>
</x-app-layout>