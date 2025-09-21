import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const Slot = React.forwardRef(({ children, ...props }, ref) => {
  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      ...children.props,
      ref: ref ? (node) => {
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
        if (children.ref) {
          if (typeof children.ref === 'function') {
            children.ref(node);
          } else if (children.ref) {
            children.ref.current = node;
          }
        }
      } : children.ref,
    });
  }
  return children;
});
Slot.displayName = "Slot";

const typographyVariants = cva("font-open", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      h5: "text-lg font-semibold",
      h6: "text-base font-semibold",
      p: "leading-7",
      // p: "leading-7 [&:not(:first-child)]:mt-6",
      blockquote: "mt-6 border-l-2 pl-6 italic",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",
      code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      list: "my-6 list-disc [&>li]:mt-2",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
      "5xl": "text-5xl",
    },
    responsive: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      variant: "h1",
      responsive: true,
      class: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl",
    },
    {
      variant: "h2",
      responsive: true,
      class: "text-xl sm:text-2xl md:text-3xl lg:text-4xl",
    },
    {
      variant: "h3",
      responsive: true,
      class: "text-lg sm:text-xl md:text-2xl lg:text-3xl",
    },
    {
      variant: "h4",
      responsive: true,
      class: "text-base sm:text-lg md:text-xl lg:text-2xl",
    },
    {
      variant: "h5",
      responsive: true,
      class: "text-sm sm:text-base md:text-lg lg:text-xl",
    },
    {
      variant: "h6",
      responsive: true,
      class: "text-xs sm:text-sm md:text-base lg:text-lg",
    },
    {
      variant: "p",
      responsive: true,
      class: "text-sm sm:text-base md:text-lg",
    },
    {
      variant: "lead",
      responsive: true,
      class: "text-lg sm:text-xl md:text-2xl",
    },
  ],
  defaultVariants: {
    variant: "p",
    responsive: false,
  },
});

const Typography = React.forwardRef(
  (
    { className, variant, size, responsive, asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : getSemanticElement(variant);

    return (
      <Comp
        ref={ref}
        className={cn(
          typographyVariants({ variant, size, responsive, className })
        )}
        {...props}
      />
    );
  }
);
Typography.displayName = "Typography";

const Heading = React.forwardRef(
  ({ level = 1, className, responsive, asChild = false, ...props }, ref) => {
    const variant = `h${Math.max(1, Math.min(6, level))}`;
    const Comp = asChild ? Slot : variant;

    return (
      <Comp
        ref={ref}
        className={cn(typographyVariants({ variant, responsive, className }))}
        {...props}
      />
    );
  }
);
Heading.displayName = "Heading";

const Paragraph = React.forwardRef(
  (
    {
      className,
      lead = false,
      muted = false,
      responsive,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const variant = lead ? "lead" : muted ? "muted" : "p";
    const Comp = asChild ? Slot : "p";

    return (
      <Comp
        ref={ref}
        className={cn(typographyVariants({ variant, responsive, className }))}
        {...props}
      />
    );
  }
);
Paragraph.displayName = "Paragraph";

const Blockquote = React.forwardRef(
  (
    { className, cite, responsive, asChild = false, children, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "blockquote";

    return (
      <Comp
        ref={ref}
        className={cn(
          typographyVariants({ variant: "blockquote", responsive, className })
        )}
        cite={cite}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
Blockquote.displayName = "Blockquote";

const Code = React.forwardRef(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "code";

    return (
      <Comp
        ref={ref}
        className={cn(typographyVariants({ variant: "code", className }))}
        {...props}
      />
    );
  }
);
Code.displayName = "Code";

const List = React.forwardRef(
  ({ className, ordered = false, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : ordered ? "ol" : "ul";
    const listClass = ordered
      ? "my-6 ml-6 list-decimal [&>li]:mt-2"
      : typographyVariants({ variant: "list" });

    return <Comp ref={ref} className={cn(listClass, className)} {...props} />;
  }
);
List.displayName = "List";

const ListItem = React.forwardRef(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "li";

    return <Comp ref={ref} className={cn("", className)} {...props} />;
  }
);
ListItem.displayName = "ListItem";

function getSemanticElement(variant) {
  const elementMap = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    p: "p",
    blockquote: "blockquote",
    lead: "p",
    large: "div",
    small: "small",
    muted: "p",
    code: "code",
    list: "ul",
  };
  return elementMap[variant] || "div";
}

Typography.h1 = React.forwardRef(
  ({ className, responsive, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "h1";
    return (
      <Comp
        ref={ref}
        className={cn(
          typographyVariants({ variant: "h1", responsive, className })
        )}
        {...props}
      />
    );
  }
);
Typography.h1.displayName = "Typography.h1";

Typography.h2 = React.forwardRef(
  ({ className, responsive, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "h2";
    return (
      <Comp
        ref={ref}
        className={cn(
          typographyVariants({ variant: "h2", responsive, className })
        )}
        {...props}
      />
    );
  }
);
Typography.h2.displayName = "Typography.h2";

Typography.h3 = React.forwardRef(
  ({ className, responsive, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "h3";
    return (
      <Comp
        ref={ref}
        className={cn(
          typographyVariants({ variant: "h3", responsive, className })
        )}
        {...props}
      />
    );
  }
);
Typography.h3.displayName = "Typography.h3";

Typography.h4 = React.forwardRef(
  ({ className, responsive, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "h4";
    return (
      <Comp
        ref={ref}
        className={cn(
          typographyVariants({ variant: "h4", responsive, className })
        )}
        {...props}
      />
    );
  }
);
Typography.h4.displayName = "Typography.h4";

Typography.h5 = React.forwardRef(
  ({ className, responsive, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "h5";
    return (
      <Comp
        ref={ref}
        className={cn(
          typographyVariants({ variant: "h5", responsive, className })
        )}
        {...props}
      />
    );
  }
);
Typography.h5.displayName = "Typography.h5";

Typography.h6 = React.forwardRef(
  ({ className, responsive, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "h6";
    return (
      <Comp
        ref={ref}
        className={cn(
          typographyVariants({ variant: "h6", responsive, className })
        )}
        {...props}
      />
    );
  }
);
Typography.h6.displayName = "Typography.h6";

Typography.p = React.forwardRef(
  (
    {
      className,
      lead = false,
      muted = false,
      responsive,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const variant = lead ? "lead" : muted ? "muted" : "p";
    const Comp = asChild ? Slot : "p";
    return (
      <Comp
        ref={ref}
        className={cn(typographyVariants({ variant, responsive, className }))}
        {...props}
      />
    );
  }
);
Typography.p.displayName = "Typography.p";

Typography.BQ = React.forwardRef(
  ({ className, cite, responsive, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "blockquote";
    return (
      <Comp
        ref={ref}
        className={cn(
          typographyVariants({ variant: "blockquote", responsive, className })
        )}
        cite={cite}
        {...props}
      />
    );
  }
);
Typography.BQ.displayName = "Typography.BQ";

Typography.code = React.forwardRef(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "code";
    return (
      <Comp
        ref={ref}
        className={cn(typographyVariants({ variant: "code", className }))}
        {...props}
      />
    );
  }
);
Typography.code.displayName = "Typography.code";

Typography.lead = React.forwardRef(
  ({ className, responsive, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "p";
    return (
      <Comp
        ref={ref}
        className={cn(
          typographyVariants({ variant: "lead", responsive, className })
        )}
        {...props}
      />
    );
  }
);
Typography.lead.displayName = "Typography.lead";

Typography.large = React.forwardRef(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn(typographyVariants({ variant: "large", className }))}
        {...props}
      />
    );
  }
);
Typography.large.displayName = "Typography.large";

Typography.small = React.forwardRef(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "small";
    return (
      <Comp
        ref={ref}
        className={cn(typographyVariants({ variant: "small", className }))}
        {...props}
      />
    );
  }
);
Typography.small.displayName = "Typography.small";

Typography.muted = React.forwardRef(
  ({ className, responsive, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "p";
    return (
      <Comp
        ref={ref}
        className={cn(
          typographyVariants({ variant: "muted", responsive, className })
        )}
        {...props}
      />
    );
  }
);
Typography.muted.displayName = "Typography.muted";

export {
  Typography,
  Heading,
  Paragraph,
  Blockquote,
  Code,
  List,
  ListItem,
  typographyVariants,
};
