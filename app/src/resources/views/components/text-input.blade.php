@props(['disabled' => false])

<input {{ $disabled ? 'disabled' : '' }} {!! $attributes->merge(['class' => 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm']) !!} 
    style="border-radius: 8px; border: 1px solid #ccc; transition: border-color 0.3s ease, box-shadow 0.3s ease; padding: 10px;"
    onfocus="this.style.borderColor='var(--color-boton)'; this.style.boxShadow='0 0 0 3px rgba(85, 126, 255, 0.25)'"
    onblur="this.style.borderColor='#ccc'; this.style.boxShadow='none'"
>