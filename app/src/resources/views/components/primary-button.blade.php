<button {{ $attributes->merge(['type' => 'submit', 'class' => 'inline-flex items-center px-6 py-3 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-wider transition ease-in-out duration-150 hover:opacity-90']) }} 
    style="background-color: var(--color-boton); color: var(--color-blanco); padding: 12px 25px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: none;"
>
    {{ $slot }}
</button>